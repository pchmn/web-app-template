import { factory } from '~/lib/factory';
import { authClient } from './auth-client';

export const authHandler = factory.createHandlers((c) =>
  authClient.handler(c.req.raw),
);
