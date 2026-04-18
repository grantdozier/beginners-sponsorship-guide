import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  jsonb,
  unique,
  index,
} from 'drizzle-orm/pg-core';
import type { InventoryData } from '../shared/inventory';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    deviceId: text('device_id').notNull().unique(),
    displayName: text('display_name').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    deviceIdIdx: index('users_device_id_idx').on(t.deviceId),
  }),
);

export const pairCodes = pgTable('pair_codes', {
  code: text('code').primaryKey(),
  creatorUserId: uuid('creator_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  // Role the creator plays once redeemed. Redeemer gets the opposite role.
  creatorRole: text('creator_role', { enum: ['sponsor', 'sponsee'] }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedByUserId: uuid('used_by_user_id').references(() => users.id, { onDelete: 'cascade' }),
  usedAt: timestamp('used_at', { withTimezone: true }),
});

export const pairs = pgTable(
  'pairs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sponsorId: uuid('sponsor_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    sponseeId: uuid('sponsee_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    uniquePair: unique('pairs_sponsor_sponsee_unique').on(t.sponsorId, t.sponseeId),
    sponsorIdx: index('pairs_sponsor_idx').on(t.sponsorId),
    sponseeIdx: index('pairs_sponsee_idx').on(t.sponseeId),
  }),
);

export const inventories = pgTable(
  'inventories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    type: text('type', { enum: ['resentment', 'fear', 'sex_conduct'] }).notNull(),
    data: jsonb('data').$type<InventoryData>().notNull(),
    isShared: boolean('is_shared').notNull().default(false),
    sharedAt: timestamp('shared_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    uniqueOwnerType: unique('inventories_owner_type_unique').on(t.ownerId, t.type),
    ownerIdx: index('inventories_owner_idx').on(t.ownerId),
  }),
);

export const progressMarkers = pgTable(
  'progress_markers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    pairId: uuid('pair_id').notNull().references(() => pairs.id, { onDelete: 'cascade' }),
    scope: text('scope', { enum: ['step', 'inventory', 'entry'] }).notNull(),
    scopeKey: text('scope_key').notNull(),
    state: text('state', { enum: ['in_progress', 'shared', 'reviewed'] }).notNull(),
    note: text('note'),
    markedByUserId: uuid('marked_by_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    markedAt: timestamp('marked_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    uniquePairScope: unique('progress_pair_scope_key_unique').on(t.pairId, t.scope, t.scopeKey),
    pairIdx: index('progress_pair_idx').on(t.pairId),
  }),
);

// Inferred TypeScript types from the schema — importable elsewhere
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PairCode = typeof pairCodes.$inferSelect;
export type Pair = typeof pairs.$inferSelect;
export type InventoryRow = typeof inventories.$inferSelect;
export type NewInventoryRow = typeof inventories.$inferInsert;
export type ProgressMarkerRow = typeof progressMarkers.$inferSelect;
