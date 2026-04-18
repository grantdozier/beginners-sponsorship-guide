import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { and, eq, or, isNull, gt } from 'drizzle-orm';
import { db } from '../db';
import { users, pairCodes, pairs } from '../db/schema';
import { requireDeviceUser } from '../middleware/auth';
import { generatePairCode, pairCodeExpiry } from '../lib/pairCode';

const app = new Hono();

const createCodeSchema = z.object({
  role: z.enum(['sponsor', 'sponsee']),
});

/**
 * POST /pair-codes — creator generates a short code.
 * role = the role the CREATOR will have once redeemed.
 */
app.post('/pair-codes', requireDeviceUser, zValidator('json', createCodeSchema), async (c) => {
  const user = c.get('user');
  const { role } = c.req.valid('json');

  // Try up to 5 times to avoid code collisions (extremely unlikely with 32^6 space).
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generatePairCode(6);
    try {
      const [created] = await db
        .insert(pairCodes)
        .values({
          code,
          creatorUserId: user.id,
          creatorRole: role,
          expiresAt: pairCodeExpiry(15),
        })
        .returning();
      return c.json({
        code: created.code,
        expires_at: created.expiresAt,
        role,
      });
    } catch (err) {
      // Unique violation → retry
      if (attempt === 4) throw err;
    }
  }
  return c.json({ error: 'code_generation_failed', message: 'Could not allocate a pair code' }, 500);
});

/**
 * POST /pair-codes/:code/redeem — redeemer enters the code.
 */
app.post('/pair-codes/:code/redeem', requireDeviceUser, async (c) => {
  const user = c.get('user');
  const code = c.req.param('code').toUpperCase();

  const [row] = await db.select().from(pairCodes).where(eq(pairCodes.code, code)).limit(1);
  if (!row) {
    return c.json({ error: 'invalid_code', message: 'That code is not valid' }, 404);
  }
  if (row.usedByUserId) {
    return c.json({ error: 'already_used', message: 'That code was already redeemed' }, 409);
  }
  if (row.expiresAt < new Date()) {
    return c.json({ error: 'expired', message: 'That code has expired' }, 410);
  }
  if (row.creatorUserId === user.id) {
    return c.json({ error: 'self_redeem', message: 'You can\'t redeem your own code' }, 400);
  }

  // Determine who is sponsor vs sponsee.
  const sponsorId = row.creatorRole === 'sponsor' ? row.creatorUserId : user.id;
  const sponseeId = row.creatorRole === 'sponsor' ? user.id : row.creatorUserId;

  // Check if pair already exists.
  const [existing] = await db
    .select()
    .from(pairs)
    .where(and(eq(pairs.sponsorId, sponsorId), eq(pairs.sponseeId, sponseeId)))
    .limit(1);

  let pair = existing;
  if (!pair) {
    const [created] = await db
      .insert(pairs)
      .values({ sponsorId, sponseeId })
      .returning();
    pair = created;
  }

  // Mark code as used
  await db
    .update(pairCodes)
    .set({ usedByUserId: user.id, usedAt: new Date() })
    .where(eq(pairCodes.code, code));

  // Fetch partner's display name
  const partnerId = pair.sponsorId === user.id ? pair.sponseeId : pair.sponsorId;
  const [partner] = await db.select().from(users).where(eq(users.id, partnerId)).limit(1);
  const myRole = pair.sponsorId === user.id ? 'sponsor' : 'sponsee';

  return c.json({
    id: pair.id,
    role: myRole,
    partner: { user_id: partner.id, display_name: partner.displayName },
    created_at: pair.createdAt,
  });
});

/**
 * GET /pairs — list all pairs this user is a member of.
 */
app.get('/pairs', requireDeviceUser, async (c) => {
  const user = c.get('user');
  const rows = await db
    .select()
    .from(pairs)
    .where(or(eq(pairs.sponsorId, user.id), eq(pairs.sponseeId, user.id)));

  // Load all partner user rows in one pass
  const partnerIds = rows.map((r) => (r.sponsorId === user.id ? r.sponseeId : r.sponsorId));
  const partnerRows = partnerIds.length
    ? await db.select().from(users).where(or(...partnerIds.map((id) => eq(users.id, id))))
    : [];
  const partnerMap = new Map(partnerRows.map((u) => [u.id, u]));

  const result = rows.map((p) => {
    const partnerId = p.sponsorId === user.id ? p.sponseeId : p.sponsorId;
    const partner = partnerMap.get(partnerId)!;
    const role = p.sponsorId === user.id ? 'sponsor' : 'sponsee';
    return {
      id: p.id,
      role,
      partner: { user_id: partner.id, display_name: partner.displayName },
      created_at: p.createdAt,
    };
  });

  return c.json(result);
});

/**
 * DELETE /pairs/:id — unpair. Either participant can delete.
 */
app.delete('/pairs/:id', requireDeviceUser, async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');

  const [p] = await db.select().from(pairs).where(eq(pairs.id, id)).limit(1);
  if (!p) return c.json({ error: 'not_found', message: 'Pair not found' }, 404);
  if (p.sponsorId !== user.id && p.sponseeId !== user.id) {
    return c.json({ error: 'forbidden', message: 'Not your pair' }, 403);
  }

  await db.delete(pairs).where(eq(pairs.id, id));
  return c.json({ deleted: true });
});

export default app;
