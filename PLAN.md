# Plan — Writable Inventories + Sponsor/Sponsee Pairing

Branch: `feature/inventory-and-backend`

---

## The vision

Sponsee fills out their Step 4 work directly in the app — Resentment Inventory,
Fear Inventory, Sex Conduct Inventory. Sponsor pairs with sponsee and can
read what sponsee wrote. Works across two phones via a simple backend. Must
ship to App Store and Google Play.

---

## Architecture at a glance

```
┌─────────────────┐       HTTPS        ┌──────────────────┐
│  SponsorGuide   │ ◄────────────────► │   api (Railway)  │
│  (Expo RN app)  │                    │   Node + Hono    │
│  iOS + Android  │                    │   + Drizzle ORM  │
└─────────────────┘                    └────────┬─────────┘
                                                │
                                                ▼
                                       ┌──────────────────┐
                                       │   PostgreSQL     │
                                       │   (Railway)      │
                                       └──────────────────┘
```

Repo layout (monorepo — single git repo, both apps in it):

```
beginners-sponsorship-guide/
├── SponsorGuide/        # existing Expo app
├── api/                 # NEW — Node + Hono API
├── shared/              # NEW — TypeScript types shared by both
└── PLAN.md              # this file
```

---

## Confirmed answers (2026-04-18)

1. One user can be both sponsor AND sponsee → ✅
2. One sponsor → many sponsees → ✅
3. Sponsor view of sponsee inventories is read-only → ✅
4. Push notifications → skip for MVP
5. Audio hosting — you don't have Cloudflare. I'll use **Railway's volume
   storage** (free up to 1GB on Hobby tier) or just keep bundled until
   shipping — decide at Phase 6.
6. PDF export → defer
7. Log sponsor views → skip
8. **NEW:** Progress tracking so sponsor + sponsee "keep their place" → added below

---

## Key design decisions

### 1. No password auth — device identity instead

**Why:** Users in early recovery are already overwhelmed. Sign-up friction kills apps.
**How:** On first launch, app generates a UUID, stores in `expo-secure-store`. Every
API request sends it as `X-Device-Id` header. That's the identity.

Tradeoff: if someone loses their phone, they lose access. We add a manual
"transfer device" flow later if needed (v2).

### 2. Pair code — 6 characters, 15-minute expiry

**Flow:**
1. Sponsor taps "Link with sponsee" → app hits API → API returns 6-char code (e.g. `A3F9K2`).
2. Sponsor reads code aloud to sponsee (or texts it).
3. Sponsee enters code in their app → API redeems → pair created.
4. Code expires in 15 min or after one successful redeem.

No email. No phone verification. Just in-person-or-call coordination — which
matches how AA sponsorship already works.

### 3. Share-on-completion, not live collaboration

**MVP:** Sponsee works on inventory. When ready, taps "Share with [sponsor]".
A snapshot is pushed to backend. Sponsor sees read-only. Sponsee can update
and re-share any time.

**Not MVP (later):** Live sync, sponsor comments/highlights.

### 4. PostgreSQL with JSONB for inventory data

Inventory shape varies — Resentment has rows with 4 columns, Fear has a chain
table, Sex Conduct has 9 questions per relationship. Rather than 10+ normalized
tables, store each inventory as a single JSONB document. Fast to iterate,
still queryable, Postgres natively supports it.

### 5. Progress tracking — "keeping their place"

Sponsor and sponsee meet over many sessions. They need to know where they
left off — which resentments they've already discussed together, which
inventories the sponsor has reviewed, where they are across the 12 steps.

Two levels of tracking, both per-pair (so a sponsor with 3 sponsees sees
each relationship's progress separately):

**Step-level status** — the big-picture progress through the 12 steps.
Each step / inventory lives in one of four states:

| State | Meaning | Who sets it |
|---|---|---|
| `not_started` | nothing yet | default |
| `in_progress` | sponsee is writing / working | auto on first edit |
| `shared` | sponsee pushed a snapshot to sponsor | sponsee taps "Share" |
| `reviewed` | read together in session; done for now | either taps "Mark reviewed" |

**Entry-level status** — for items that repeat (resentments, relationships),
each individual entry has a single `reviewed` checkbox. So if a sponsee has
30 resentments and they discuss 6 on Monday, those 6 are checked and both
sides know where to pick up on Thursday.

Entry-level is MVP for Resentment Inventory (most repeated entries). Fear
and Sex Conduct get step-level only in v1. Can add entry-level later.

### 6. Privacy stance

Inventory content is the most private kind of writing a person does. Even
without real auth, we must:
- Treat device ID like a secret (never log it, never expose in URLs)
- Serve over HTTPS only (Railway gives this free)
- Users can delete their data and all shared copies (App Store requirement)
- Privacy policy page before App Store submission

---

## Data model (PostgreSQL, via Drizzle ORM)

```sql
users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT UNIQUE NOT NULL,      -- from expo-secure-store
  display_name TEXT NOT NULL,          -- user-chosen, shown to partner
  created_at TIMESTAMPTZ DEFAULT NOW()
)

pair_codes (
  code TEXT PRIMARY KEY,               -- 6-char A-Z0-9
  creator_user_id UUID REFERENCES users NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,     -- +15 minutes
  used_by_user_id UUID REFERENCES users NULL
)

pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID REFERENCES users NOT NULL,
  sponsee_id UUID REFERENCES users NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sponsor_id, sponsee_id)
)

inventories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users NOT NULL,       -- always the sponsee
  type TEXT NOT NULL,                            -- 'resentment' | 'fear' | 'sex_conduct'
  data JSONB NOT NULL,
  is_shared BOOLEAN DEFAULT FALSE,
  shared_at TIMESTAMPTZ NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(owner_id, type)                         -- one inventory per type per user
)

progress_markers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_id UUID REFERENCES pairs NOT NULL,        -- progress is per-relationship
  scope TEXT NOT NULL,                           -- 'step' | 'inventory' | 'entry'
  scope_key TEXT NOT NULL,                       -- e.g. 'step_4' | 'inv_resentment' | 'entry_resentment:<uuid>'
  state TEXT NOT NULL,                           -- 'in_progress' | 'shared' | 'reviewed'
  note TEXT NULL,                                -- optional context, e.g. "discussed 4/18"
  marked_by_user_id UUID REFERENCES users NOT NULL,
  marked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pair_id, scope, scope_key)              -- one marker per scope per pair
)
```

### JSONB shapes

**Resentment inventory:**
```json
{
  "resentments": [
    {
      "id": "local-uuid-1",
      "col1_person": "Mr. Brown",
      "col2_cause": "Attention to my wife, told of mistress, may take my job",
      "col3": {
        "self_esteem": { "text": "I am a good husband", "fear": "Not good enough" },
        "pride": { "text": "...", "fear": "..." },
        ...
      },
      "col4": {
        "realization": "...",
        "self_seeking": "...",
        "selfish": "...",
        "dishonest": "...",
        "afraid": "...",
        "harm": "..."
      }
    }
  ]
}
```

**Fear inventory:**
```json
{
  "chains": [
    { "fears": ["not good enough", "unwanted", "alone", "pain", "drink", "die"] }
  ],
  "harms": "..."
}
```

**Sex Conduct inventory:**
```json
{
  "relationships": [
    {
      "id": "local-uuid-1",
      "name": "Bill",
      "relationship": "Friend's Husband",
      "history": {
        "motives": "...",
        "conduct": "...",
        "major_points": "...",
        "ended": "..."
      },
      "nine_questions": {
        "selfish": "...",
        "dishonest": "...",
        "inconsiderate": "...",
        "hurt": "...",
        "jealousy": "...",
        "suspicion": "...",
        "bitterness": "...",
        "fault": "...",
        "should_have": "..."
      },
      "harm": "..."
    }
  ]
}
```

---

## API surface (REST, JSON, HTTPS)

All requests (except `POST /users` on first install) include `X-Device-Id`
header. Server looks up user by device_id; 401 if not found.

```
POST   /users                          # first launch: create user
PATCH  /users/me                       # set display_name
GET    /users/me                       # read profile

POST   /pair-codes                     # generate 6-char code (sponsor)
POST   /pair-codes/:code/redeem        # redeem code (sponsee)

GET    /pairs                          # list all my pairs (both roles)
DELETE /pairs/:id                      # unpair

GET    /inventories                    # my own inventories
PUT    /inventories/:type              # upsert my inventory (draft)
POST   /inventories/:type/share        # mark as shared

GET    /partners/:pairId/inventories   # view partner's shared inventories
GET    /partners/:pairId/inventories/:type

GET    /pairs/:pairId/progress         # all progress markers for this pair
PUT    /pairs/:pairId/progress         # upsert a marker { scope, scope_key, state, note }
DELETE /pairs/:pairId/progress/:key    # clear a marker (e.g. "un-review")

DELETE /users/me                       # delete account + all data (App Store req)
```

No real-time events in MVP — sponsor pulls when opening app.

---

## Phased rollout

### Phase 1 — Writable forms, local-only (3–5 days)
**Goal:** sponsee can fill out inventories; data persists on device.
- Install `@react-native-async-storage/async-storage`
- Rewrite `ResentmentInventoryScreen` with `TextInput` fields
- Same for `FearInventoryScreen` and `SexInventoryScreen`
- Add "Add another resentment" / "Add another relationship" buttons
- Save on blur; load on mount
- No backend. No sharing. Just local.

**Ship to yourself first** — use it on your own sponsees for a few days before
building the backend. Find the form UX pain points.

### Phase 2 — Backend scaffolding (2–3 days)
- New Railway project: `sponsor-guide-api`
- `api/` folder: Node 20, Hono, Drizzle ORM, zod for validation
- PostgreSQL on Railway
- Endpoints: `POST /users`, `GET /users/me`, device-ID middleware
- CI/CD: Railway auto-deploys on push to main (same as Ocean project)
- `shared/types.ts` — TypeScript types for API request/response shapes,
  imported by both frontend and backend

### Phase 3 — Sync own inventories (2 days)
- Add `expo-secure-store` for device ID
- API client module in frontend
- On app open: POST /users if first time
- Inventory screens: save to AsyncStorage AND to server (debounced)
- "Syncing..." / "Synced" UI state

### Phase 4 — Pairing (3 days)
- Settings screen: "Link with sponsor" / "Link with sponsee" buttons
- Code-generation flow (sponsor)
- Code-entry flow (sponsee)
- Pairs list
- Display partner's name on inventory screens

### Phase 5 — Sharing (2 days)
- "Share with [sponsor name]" button on inventory screen
- Sponsor home screen: "Inventories shared with you" section
- Read-only partner view of shared inventories
- Re-share updates the snapshot

### Phase 6 — Progress tracking (2 days)
- `progress_markers` table + API endpoints
- Step-level state on home screen: small status badges on each nav card
  ("in progress", "shared", "reviewed") — different colored for each
- Entry-level "reviewed" checkboxes on each resentment row
- "Jump to next unreviewed" button on Resentment Inventory (so sponsor opens
  the app and lands right where they left off)
- "Last reviewed 4 days ago" timestamp on shared inventories

### Phase 7 — App Store polish (5–7 days)
- Privacy policy page (static HTML on Railway or GitHub Pages)
- Terms of service
- "Delete my data" in settings
- Onboarding flow (pick name, optionally link on first launch)
- App icon + splash screen finalized
- EAS Build for iOS + Android
- TestFlight internal testing
- App Store submission

**Total: ~3.5 weeks of focused work**

---

## Things NOT in this plan

- Real-time collaboration / live cursors
- Encryption at rest (Postgres disk encryption at Railway is enough for MVP)
- End-to-end encryption (fancy but adds weeks; we're not Signal)
- Email notifications
- Web version (phones only for v1)
- AI features (no)

---

## Cost

- Railway Hobby: **$5/month** covers Postgres + API service
- Apple Developer: **$99/yr** (you have)
- Google Play: **$25 one-time**
- Cloudflare R2 for audio: **~$0.15/month** for 100MB stored + minimal egress
- Domain for privacy policy: **~$12/yr** (optional — can use GitHub Pages free)

**Total: ~$6/month + $99/yr + $25 once.**

---

## Ready to start

All open questions are answered. Next up: scaffold the monorepo structure
(`api/`, `shared/`), then kick off Phase 1 — writable forms with local-only
persistence. No backend yet. You dogfood it on your own sponsees for a few
days before we commit to the server infrastructure.
