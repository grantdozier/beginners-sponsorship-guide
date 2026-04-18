import { Hono } from 'hono';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { inventories, pairs } from '../db/schema';
import { requireDeviceUser } from '../middleware/auth';

const app = new Hono();

const typeSchema = z.enum(['resentment', 'fear', 'sex_conduct']);

/**
 * Given a pair ID and the current user, return the partner's user ID
 * (the non-self side of the pair) — or null if the user isn't in this pair.
 */
async function getPartnerIdInPair(pairId: string, userId: string): Promise<string | null> {
  const [p] = await db.select().from(pairs).where(eq(pairs.id, pairId)).limit(1);
  if (!p) return null;
  if (p.sponsorId === userId) return p.sponseeId;
  if (p.sponseeId === userId) return p.sponsorId;
  return null;
}

/** GET /partners/:pairId/inventories — list partner's SHARED inventories */
app.get('/:pairId/inventories', requireDeviceUser, async (c) => {
  const user = c.get('user');
  const pairId = c.req.param('pairId');
  const partnerId = await getPartnerIdInPair(pairId, user.id);
  if (!partnerId) return c.json({ error: 'forbidden', message: 'Not your pair' }, 403);

  const rows = await db
    .select()
    .from(inventories)
    .where(and(eq(inventories.ownerId, partnerId), eq(inventories.isShared, true)));

  return c.json(
    rows.map((r) => ({
      id: r.id,
      type: r.type,
      data: r.data,
      is_shared: r.isShared,
      shared_at: r.sharedAt,
      updated_at: r.updatedAt,
    })),
  );
});

/** GET /partners/:pairId/inventories/:type — specific shared inventory */
app.get('/:pairId/inventories/:type', requireDeviceUser, async (c) => {
  const user = c.get('user');
  const pairId = c.req.param('pairId');
  const partnerId = await getPartnerIdInPair(pairId, user.id);
  if (!partnerId) return c.json({ error: 'forbidden', message: 'Not your pair' }, 403);

  const typeResult = typeSchema.safeParse(c.req.param('type'));
  if (!typeResult.success) {
    return c.json({ error: 'invalid_type', message: 'Unknown inventory type' }, 400);
  }

  const [row] = await db
    .select()
    .from(inventories)
    .where(
      and(
        eq(inventories.ownerId, partnerId),
        eq(inventories.type, typeResult.data),
        eq(inventories.isShared, true),
      ),
    )
    .limit(1);

  if (!row) return c.json({ error: 'not_found', message: 'Partner has not shared this inventory' }, 404);

  return c.json({
    id: row.id,
    type: row.type,
    data: row.data,
    is_shared: row.isShared,
    shared_at: row.sharedAt,
    updated_at: row.updatedAt,
  });
});

export default app;
