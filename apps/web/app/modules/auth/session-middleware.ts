import type { Session, User } from 'better-auth/types';

import {
  type unstable_MiddlewareFunction,
  type unstable_RouterContextProvider,
  unstable_createContext,
} from 'react-router';
import type { Route } from '../../+types/root';
import { authClient } from './auth-client';

const sessionContext = unstable_createContext<{
  session: Session;
  user: User;
} | null>();

export const sessionMiddleware: unstable_MiddlewareFunction<Response> = async (
  { request, context },
  next,
) => {
  const { data } = await authClient.getSession({
    fetchOptions: {
      headers: request.headers,
    },
  });

  context.set(sessionContext, data);

  const response = await next();

  return response;
};

export const clientSessionMiddleware: Route.unstable_ClientMiddlewareFunction =
  async ({ request, context }, next) => {
    const { data } = await authClient.getSession({
      fetchOptions: {
        headers: request.headers,
      },
    });
    context.set(sessionContext, data);

    await next();
  };

export function getSession(context: unstable_RouterContextProvider) {
  return context.get(sessionContext);
}
