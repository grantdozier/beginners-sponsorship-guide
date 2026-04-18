// Inventory data shapes — stored as JSONB in Postgres, identical shape in the client.

export type InventoryType = 'resentment' | 'fear' | 'sex_conduct';

// =============================================================
// Resentment Inventory
// =============================================================

export type ResentmentArea =
  | 'self_esteem'
  | 'pride'
  | 'ambition'
  | 'security'
  | 'personal_relations'
  | 'sex_relations'
  | 'pocket_book';

export interface ResentmentColumn3 {
  self_esteem: { text: string; fear: string };
  pride: { text: string; fear: string };
  ambition: { text: string; fear: string };
  security: { text: string; fear: string };
  personal_relations: { text: string; fear: string };
  sex_relations: { text: string; fear: string };
  pocket_book: { text: string; fear: string };
}

export interface ResentmentColumn4 {
  realization: string;
  self_seeking: string;
  selfish: string;
  dishonest: string;
  afraid: string;
  harm: string;
}

export interface ResentmentEntry {
  id: string;                 // client-generated UUID
  col1_person: string;         // "I am resentful at..."
  col2_cause: string;          // "The cause..."
  col3: ResentmentColumn3;
  col4: ResentmentColumn4;
  created_at: string;          // ISO timestamp
}

export interface ResentmentInventoryData {
  resentments: ResentmentEntry[];
}

// =============================================================
// Fear Inventory
// =============================================================

export interface FearChainEntry {
  id: string;                  // client-generated UUID
  // Chain: each step is "why do I have this fear?" drilling deeper
  // Example: ["not good enough", "unwanted", "alone", "pain", "drink", "die"]
  chain: string[];
}

export interface FearInventoryData {
  chains: FearChainEntry[];
  harms: string;               // "how my fears caused harm and to whom"
}

// =============================================================
// Sex Conduct Inventory
// =============================================================

export interface SexConductRelationship {
  id: string;                  // client-generated UUID
  name: string;
  relationship: string;        // e.g. "Friend's husband"
  history: {
    motives: string;            // "my motives for getting involved..."
    conduct: string;            // "my specific conduct..."
    major_points: string;       // "the major points that came up..."
    ended: string;              // "how did it end / how it is now..."
  };
  nine_questions: {
    selfish: string;
    dishonest: string;
    inconsiderate: string;
    hurt: string;                // whom did I hurt
    jealousy: string;            // did I arouse jealousy
    suspicion: string;
    bitterness: string;
    fault: string;               // where was I at fault
    should_have: string;         // what I should have done instead
  };
  harm: string;
  created_at: string;
}

export interface FutureSexIdealData {
  items: string[];              // ordered list of "God, in the future I'd like to be..."
}

export interface SexConductInventoryData {
  relationships: SexConductRelationship[];
  future_ideal: FutureSexIdealData;
}

// =============================================================
// Union of all inventory data shapes
// =============================================================

export type InventoryData =
  | ResentmentInventoryData
  | FearInventoryData
  | SexConductInventoryData;

// =============================================================
// Empty/initial shapes — used when creating a new inventory
// =============================================================

export const emptyResentmentColumn3 = (): ResentmentColumn3 => ({
  self_esteem: { text: '', fear: '' },
  pride: { text: '', fear: '' },
  ambition: { text: '', fear: '' },
  security: { text: '', fear: '' },
  personal_relations: { text: '', fear: '' },
  sex_relations: { text: '', fear: '' },
  pocket_book: { text: '', fear: '' },
});

export const emptyResentmentColumn4 = (): ResentmentColumn4 => ({
  realization: '',
  self_seeking: '',
  selfish: '',
  dishonest: '',
  afraid: '',
  harm: '',
});

export const emptyResentmentEntry = (id: string): ResentmentEntry => ({
  id,
  col1_person: '',
  col2_cause: '',
  col3: emptyResentmentColumn3(),
  col4: emptyResentmentColumn4(),
  created_at: new Date().toISOString(),
});

export const emptyResentmentInventory = (): ResentmentInventoryData => ({
  resentments: [],
});

export const emptyFearInventory = (): FearInventoryData => ({
  chains: [],
  harms: '',
});

export const emptySexConductRelationship = (id: string): SexConductRelationship => ({
  id,
  name: '',
  relationship: '',
  history: { motives: '', conduct: '', major_points: '', ended: '' },
  nine_questions: {
    selfish: '', dishonest: '', inconsiderate: '', hurt: '',
    jealousy: '', suspicion: '', bitterness: '', fault: '', should_have: '',
  },
  harm: '',
  created_at: new Date().toISOString(),
});

export const emptySexConductInventory = (): SexConductInventoryData => ({
  relationships: [],
  future_ideal: { items: [] },
});
