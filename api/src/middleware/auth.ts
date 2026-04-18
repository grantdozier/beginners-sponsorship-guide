import type { MiddlewareHandler } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users, type User } from '../db/schema';

declare module 'hono' {
  interface ContextVariableMap {
    user: User;
  }
}

/**
 * Looks up the user by X-Device-Id header. Fails 401 if missing or unknown.
 * This is our "auth" — not true auth, but device ID is treated as a bearer token.
 */
export const requireDeviceUser: MiddlewareHandler = async (c, next) => {
  const deviceId = c.req.header('X-Device-Id');
  if (!deviceId) {
    return c.json({ error: 'missing_device_id', message: 'X-Device-Id header required' }, 401);
  }

  const [user] = await db.select().from(users).where(eq(users.deviceId, deviceId)).limit(1);
  if (!user) {
    return c.json({ error: 'unknown_device', message: 'No user registered for this device' }, 401);
  }

  c.set('user', user);
  await next();
};
