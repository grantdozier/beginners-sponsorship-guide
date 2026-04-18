import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';

import users from './routes/users';
import pairs from './routes/pairs';
import inventories from './routes/inventories';
import partners from './routes/partners';
import progress from './routes/progress';

const app = new Hono();

app.use('*', logger());
app.use('*', cors({ origin: '*', allowHeaders: ['Content-Type', 'X-Device-Id'] }));

// Liveness / health
app.get('/', (c) => c.json({ service: 'sponsor-guide-api', status: 'ok' }));
app.get('/healthz', (c) => c.json({ ok: true }));

app.route('/users', users);
app.route('/', pairs);         // /pair-codes and /pairs both live here
app.route('/inventories', inventories);
app.route('/partners', partners);
app.route('/pairs', progress); // /pairs/:pairId/progress

app.onError((err, c) => {
  console.error('[api error]', err);
  return c.json({ error: 'internal', message: err.message }, 500);
});

const port = Number(process.env.PORT ?? 8080);

console.log(`sponsor-guide-api listening on 0.0.0.0:${port}`);

serve({ fetch: app.fetch, port, hostname: '0.0.0.0' });
