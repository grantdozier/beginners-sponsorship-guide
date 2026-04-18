import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { pairs, progressMarkers } from '../db/schema';
import { requireDeviceUser } from '../middleware/auth';

const app = new Hono();

const upsertSchema = z.object({
  scope: z.enum(['step', 'inventory', 'entry']),
  scope_key: z.string().min(1).max(200),
  state: z.enum(['in_progress', 'shared', 'reviewed']),
  note: z.string().max(500).optional(),
});

async function assertInPair(pairId: string, userId: string): Promise<boolean> {
  const [p] = await db.select().from(pairs).where(eq(pairs.id, pairId)).limit(1);
  if (!p) return false;
  return p.sponsorId === userId || p.sponseeId === userId;
}

function toDto(row: typeof progressMarkers.$inferSelect) {
  return {
    scope: row.scope,
    scope_key: row.scopeKey,
    state: row.state,
    note: row.note,
    marked_by_user_id: row.markedByUserId,
    marked_at: row.markedAt,
  };
}

/** GET /pairs/:pairId/progress — all markers for this pair */
app.get('/:pairId/progress', requireDeviceUser, async (c) => {
  const user = c.get('user');
  const pairId = c.req.param('pairId');
  if (!(await assertInPair(pairId, user.id))) {
    return c.json({ error: 'forbidden', message: 'Not your pair' }, 403);
  }

  const rows = await db.select().from(progressMarkers).where(eq(progressMarkers.pairId, pairId));
  return c.json(rows.map(toDto));
});

/** PUT /pairs/:pairId/progress — upsert a marker */
app.put('/:pairId/progress', requireDeviceUser, zValidator('json', upsertSchema), async (c) => {
  const user = c.get('user');
  const pairId = c.req.param('pairId');
  if (!(await assertInPair(pairId, user.id))) {
    return c.json({ error: 'forbidden', message: 'Not your pair' }, 403);
  }

  const body = c.req.valid('json');

  const [existing] = await db
    .select()
    .from(progressMarkers)
    .where(
      and(
        eq(progressMarkers.pairId, pairId),
        eq(progressMarkers.scope, body.scope),
        eq(progressMarkers.scopeKey, body.scope_key),
      ),
    )
    .limit(1);

  if (existing) {
    const [updated] = await db
      .update(progressMarkers)
      .set({
        state: body.state,
        note: body.note ?? null,
        markedByUserId: user.id,
        markedAt: new Date(),
      })
      .where(eq(progressMarkers.id, existing.id))
      .returning();
    return c.json(toDto(updated));
  }

  const [created] = await db
    .insert(progressMarkers)
    .values({
      pairId,
      scope: body.scope,
      scopeKey: body.scope_key,
      state: body.state,
      note: body.note ?? null,
      markedByUserId: user.id,
    })
    .returning();
  return c.json(toDto(created), 201);
});

/** DELETE /pairs/:pairId/progress/:key — clear a marker */
app.delete('/:pairId/progress/:key', requireDeviceUser, async (c) => {
  const user = c.get('user');
  const pairId = c.req.param('pairId');
  const scopeKey = c.req.param('key');
  if (!(await assertInPair(pairId, user.id))) {
    return c.json({ error: 'forbidden', message: 'Not your pair' }, 403);
  }

  await db
    .delete(progressMarkers)
    .where(and(eq(progressMarkers.pairId, pairId), eq(progressMarkers.scopeKey, scopeKey)));

  return c.json({ deleted: true });
});

export default app;
