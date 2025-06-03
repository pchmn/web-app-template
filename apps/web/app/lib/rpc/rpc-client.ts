import { hc } from 'hono/client';
import type { App } from '../../../../server/src';

export const rpcClient = hc<App>(import.meta.env.VITE_SERVER_URL, {
  init: {
    credentials: 'include',
  },
});
