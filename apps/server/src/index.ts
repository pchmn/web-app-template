import 'dotenv/config';

import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { factory } from '~/lib/factory';
import { aiHandler } from './modules/ai/ai-handler';
import { authHandler } from './modules/auth/auth-handler';
import { requireAuth, session } from './modules/auth/auth-middlewares';

const app = factory.createApp();
app.use(logger());
app.use(
  '/*',
  cors({
    origin: process.env.CORS_ORIGIN || '',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
  session,
);

const routes = app
  .get('/health', (c) =>
    c.json({
      status: 'ok',
    }),
  )
  .on(['POST', 'GET'], '/auth/**', ...authHandler)
  .post('/ai', requireAuth, ...aiHandler)
  .get('/private', requireAuth, (c) =>
    c.json({
      message: 'This is a private route',
      user: c.get('user'),
    }),
  );

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

export type App = typeof routes;
