import type { Session, User } from 'better-auth';
import type { Handler } from 'hono';
import { createFactory } from 'hono/factory';
import { requireAuth } from '~/features/auth/auth-middlewares';

export const factory = createFactory<{
  Variables: {
    session: Session | null;
    user: User | null;
  };
}>();

export const createHandler = (handler: Handler) => {
  return factory.createHandlers(handler);
};

export const protectedHandler = (handler: Handler) => {
  return factory.createHandlers(requireAuth, handler);
};

export const publicHandler = (handler: Handler) => {
  return factory.createHandlers(handler);
};
