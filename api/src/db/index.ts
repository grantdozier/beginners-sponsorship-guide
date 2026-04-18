import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

// Railway's internal URL (postgres.railway.internal) is on a private network
// and doesn't use SSL. Only enable SSL for public/external URLs.
const isInternalRailway = connectionString.includes('.railway.internal');

export const pool = new Pool({
  connectionString,
  ssl: isInternalRailway ? false : { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });
