// Request/response types for the API.
import type { InventoryType, InventoryData } from './inventory';

// =============================================================
// Users
// =============================================================

export interface User {
  id: string;
  display_name: string;
  created_at: string;
}

export interface CreateUserBody {
  device_id: string;
  display_name: string;
}

export interface UpdateUserBody {
  display_name?: string;
}

// =============================================================
// Pair codes & pairs
// =============================================================

export interface PairCode {
  code: string;                 // 6 chars, e.g. "A3F9K2"
  expires_at: string;           // ISO
  role: 'sponsor' | 'sponsee';  // role of the creator when this code is redeemed
}

export interface CreatePairCodeBody {
  // The role the *creator* will assume in the pair once the code is redeemed.
  // If creator is 'sponsor', whoever redeems becomes the 'sponsee' and vice versa.
  role: 'sponsor' | 'sponsee';
}

export interface Partner {
  user_id: string;
  display_name: string;
}

export interface Pair {
  id: string;
  role: 'sponsor' | 'sponsee';  // MY role in this pair
  partner: Partner;
  created_at: string;
}

// =============================================================
// Inventories
// =============================================================

export interface Inventory {
  id: string;
  type: InventoryType;
  data: InventoryData;
  is_shared: boolean;
  shared_at: string | null;
  updated_at: string;
}

export interface UpsertInventoryBody {
  data: InventoryData;
}

// =============================================================
// Progress markers
// =============================================================

export type ProgressScope = 'step' | 'inventory' | 'entry';
export type ProgressState = 'in_progress' | 'shared' | 'reviewed';

export interface ProgressMarker {
  scope: ProgressScope;
  scope_key: string;            // e.g. 'step_4' | 'inv_resentment' | 'entry_resentment:<uuid>'
  state: ProgressState;
  note: string | null;
  marked_by_user_id: string;
  marked_at: string;
}

export interface UpsertProgressBody {
  scope: ProgressScope;
  scope_key: string;
  state: ProgressState;
  note?: string;
}

// =============================================================
// Standard error response
// =============================================================

export interface ApiError {
  error: string;
  message: string;
}
