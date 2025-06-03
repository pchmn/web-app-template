import { factory } from '~/lib/factory';
import { authClient } from './auth-client';

export const session = factory.createMiddleware(async (c, next) => {
  const session = await authClient.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    c.set('user', null);
    c.set('session', null);
    return next();
  }

  c.set('user', session.user);
  c.set('session', session.session);
  return next();
});

export const requireAuth = factory.createMiddleware(async (c, next) => {
  if (!c.get('session')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  return next();
});
