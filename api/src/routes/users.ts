import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users, inventories, pairs, progressMarkers } from '../db/schema';
import { requireDeviceUser } from '../middleware/auth';

const app = new Hono();

const createUserSchema = z.object({
  device_id: z.string().min(8).max(128),
  display_name: z.string().min(1).max(60).trim(),
});

const updateUserSchema = z.object({
  display_name: z.string().min(1).max(60).trim().optional(),
});

// Create a user (first launch). If device_id already exists, returns that user.
app.post('/', zValidator('json', createUserSchema), async (c) => {
  const { device_id, display_name } = c.req.valid('json');

  // Upsert-ish: return existing if device_id is known, otherwise create.
  const [existing] = await db.select().from(users).where(eq(users.deviceId, device_id)).limit(1);
  if (existing) {
    return c.json({ id: existing.id, display_name: existing.displayName, created_at: existing.createdAt });
  }

  const [created] = await db
    .insert(users)
    .values({ deviceId: device_id, displayName: display_name })
    .returning();
  return c.json(
    { id: created.id, display_name: created.displayName, created_at: created.createdAt },
    201,
  );
});

// GET /users/me
app.get('/me', requireDeviceUser, (c) => {
  const user = c.get('user');
  return c.json({ id: user.id, display_name: user.displayName, created_at: user.createdAt });
});

// PATCH /users/me — update display_name
app.patch('/me', requireDeviceUser, zValidator('json', updateUserSchema), async (c) => {
  const user = c.get('user');
  const body = c.req.valid('json');

  const [updated] = await db
    .update(users)
    .set({ displayName: body.display_name ?? user.displayName })
    .where(eq(users.id, user.id))
    .returning();

  return c.json({ id: updated.id, display_name: updated.displayName, created_at: updated.createdAt });
});

// DELETE /users/me — cascades to all pairs, inventories, and progress
app.delete('/me', requireDeviceUser, async (c) => {
  const user = c.get('user');
  await db.delete(users).where(eq(users.id, user.id));
  return c.json({ deleted: true });
});

export default app;
