import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

// =============================================================
// Keys
// =============================================================

const INVENTORY_KEY = (type) => `@sponsorguide:inventory:${type}`;
const DEVICE_KEY = '@sponsorguide:device_id';

// =============================================================
// Device ID (persistent, one per install)
// =============================================================
// Using AsyncStorage rather than SecureStore for simplicity. We can migrate
// to SecureStore later without changing the API since this is the only
// consumer.

export async function getOrCreateDeviceId() {
  const existing = await AsyncStorage.getItem(DEVICE_KEY);
  if (existing) return existing;
  const id = Crypto.randomUUID();
  await AsyncStorage.setItem(DEVICE_KEY, id);
  return id;
}

// =============================================================
// Inventory CRUD — local-first. Backend sync comes later.
// =============================================================

export async function loadInventory(type) {
  const raw = await AsyncStorage.getItem(INVENTORY_KEY(type));
  return raw ? JSON.parse(raw) : null;
}

export async function saveInventory(type, data) {
  await AsyncStorage.setItem(INVENTORY_KEY(type), JSON.stringify(data));
}

export async function deleteInventory(type) {
  await AsyncStorage.removeItem(INVENTORY_KEY(type));
}

// =============================================================
// Inventory shapes — mirror shared/src/inventory.ts
// =============================================================

export function newId() {
  return Crypto.randomUUID();
}

export function emptyResentmentEntry() {
  return {
    id: newId(),
    col1_person: '',
    col2_cause: '',
    col3: {
      self_esteem: { text: '', fear: '' },
      pride: { text: '', fear: '' },
      ambition: { text: '', fear: '' },
      security: { text: '', fear: '' },
      personal_relations: { text: '', fear: '' },
      sex_relations: { text: '', fear: '' },
      pocket_book: { text: '', fear: '' },
    },
    col4: {
      realization: '',
      self_seeking: '',
      selfish: '',
      dishonest: '',
      afraid: '',
      harm: '',
    },
    created_at: new Date().toISOString(),
  };
}

export function emptyResentmentInventory() {
  return { resentments: [] };
}

export function emptyFearInventory() {
  return { chains: [], harms: '' };
}

export function emptyFearChain() {
  return {
    id: newId(),
    chain: [''],
  };
}

export function emptySexConductRelationship() {
  return {
    id: newId(),
    name: '',
    relationship: '',
    history: { motives: '', conduct: '', major_points: '', ended: '' },
    nine_questions: {
      selfish: '', dishonest: '', inconsiderate: '', hurt: '',
      jealousy: '', suspicion: '', bitterness: '', fault: '', should_have: '',
    },
    harm: '',
    created_at: new Date().toISOString(),
  };
}

export function emptySexConductInventory() {
  return { relationships: [], future_ideal: { items: [] } };
}
