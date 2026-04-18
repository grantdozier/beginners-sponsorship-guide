# sponsor-guide-api

Node + Hono + Drizzle + PostgreSQL backend for the Beginners Sponsorship Guide app.

## Local dev

```bash
cp .env.example .env.local
# fill in DATABASE_URL (point at a local Postgres or Railway branch DB)
npm install
npm run db:generate   # produce migration from schema
npm run db:migrate    # apply it to DATABASE_URL
npm run dev           # hot-reload server on :8080
```

## Endpoints

All endpoints except `POST /users` require `X-Device-Id` header.

| Method | Path | Description |
|---|---|---|
| POST | `/users` | Create or return user for this device |
| GET | `/users/me` | Get my profile |
| PATCH | `/users/me` | Update display_name |
| DELETE | `/users/me` | Delete my account + all data |
| POST | `/pair-codes` | Generate 6-char pair code (15 min expiry) |
| POST | `/pair-codes/:code/redeem` | Redeem a code, create pair |
| GET | `/pairs` | List my pairs |
| DELETE | `/pairs/:id` | Unpair |
| GET | `/inventories` | List my inventories |
| PUT | `/inventories/:type` | Upsert my draft |
| POST | `/inventories/:type/share` | Flag as shared |
| DELETE | `/inventories/:type` | Delete my inventory |
| GET | `/partners/:pairId/inventories` | Partner's shared inventories |
| GET | `/partners/:pairId/inventories/:type` | Specific shared inventory |
| GET | `/pairs/:pairId/progress` | Progress markers for pair |
| PUT | `/pairs/:pairId/progress` | Upsert a marker |
| DELETE | `/pairs/:pairId/progress/:key` | Clear a marker |

## Deploy

Railway auto-deploys from `main` branch (or whatever branch is configured).
The `railway.json` runs `db:migrate` before `start` so schema is always
up to date on deploy.
