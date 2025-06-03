import type { Session, User } from 'better-auth';
import { createFactory } from 'hono/factory';

export const factory = createFactory<{
  Variables: {
    session: Session | null;
    user: User | null;
  };
}>();
