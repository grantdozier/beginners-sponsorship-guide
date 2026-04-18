import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { inventories, pairs } from '../db/schema';
import { requireDeviceUser } from '../middleware/auth';

const app = new Hono();

const typeSchema = z.enum(['resentment', 'fear', 'sex_conduct']);

const upsertSchema = z.object({
  // We accept any JSON for `data` — validation of the nested shape happens
  // client-side via shared/ types. Postgres stores the whole blob as JSONB.
  data: z.any(),
});

function toDto(row: typeof inventories.$inferSelect) {
  return {
    id: row.id,
    type: row.type,
    data: row.data,
    is_shared: row.isShared,
    shared_at: row.sharedAt,
    updated_at: row.updatedAt,
  };
}

/** GET /inventories — all of mine */
app.get('/', requireDeviceUser, async (c) => {
  const user = c.get('user');
  const rows = await db.select().from(inventories).where(eq(inventories.ownerId, user.id));
  return c.json(rows.map(toDto));
});

/** PUT /inventories/:type — upsert my draft */
app.put('/:type', requireDeviceUser, zValidator('json', upsertSchema), async (c) => {
  const user = c.get('user');
  const typeResult = typeSchema.safeParse(c.req.param('type'));
  if (!typeResult.success) {
    return c.json({ error: 'invalid_type', message: 'Unknown inventory type' }, 400);
  }
  const type = typeResult.data;
  const { data } = c.req.valid('json');

  const [existing] = await db
    .select()
    .from(inventories)
    .where(and(eq(inventories.ownerId, user.id), eq(inventories.type, type)))
    .limit(1);

  if (existing) {
    const [updated] = await db
      .update(inventories)
      .set({ data, updatedAt: new Date() })
      .where(eq(inventories.id, existing.id))
      .returning();
    return c.json(toDto(updated));
  }

  const [created] = await db
    .insert(inventories)
    .values({ ownerId: user.id, type, data })
    .returning();
  return c.json(toDto(created), 201);
});

/** POST /inventories/:type/share — flag as shared with all partners */
app.post('/:type/share', requireDeviceUser, async (c) => {
  const user = c.get('user');
  const typeResult = typeSchema.safeParse(c.req.param('type'));
  if (!typeResult.success) {
    return c.json({ error: 'invalid_type', message: 'Unknown inventory type' }, 400);
  }
  const type = typeResult.data;

  const [inv] = await db
    .select()
    .from(inventories)
    .where(and(eq(inventories.ownerId, user.id), eq(inventories.type, type)))
    .limit(1);

  if (!inv) return c.json({ error: 'not_found', message: 'No inventory to share' }, 404);

  const [updated] = await db
    .update(inventories)
    .set({ isShared: true, sharedAt: new Date() })
    .where(eq(inventories.id, inv.id))
    .returning();

  return c.json(toDto(updated));
});

/** DELETE /inventories/:type — delete my own inventory */
app.delete('/:type', requireDeviceUser, async (c) => {
  const user = c.get('user');
  const typeResult = typeSchema.safeParse(c.req.param('type'));
  if (!typeResult.success) {
    return c.json({ error: 'invalid_type', message: 'Unknown inventory type' }, 400);
  }
  await db
    .delete(inventories)
    .where(and(eq(inventories.ownerId, user.id), eq(inventories.type, typeResult.data)));
  return c.json({ deleted: true });
});

export default app;
