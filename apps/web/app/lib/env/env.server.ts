import { z } from 'zod/v4';

const envSchema = z.object({
  client: z.object({
    VITE_SERVER_URL: z.url(),
    VITE_APP_ENV: z
      .enum(['development', 'preview', 'production'])
      .default('development'),
  }),
  // /!\ Server only env variables => do not leak to the client
  server: z.object({}),
});

let loadedEnv: z.infer<typeof envSchema>;

/**
 * @description Use this to access env (client and server) variables. /!\ Do not leak SERVER env to the client
 */
export function loadEnv() {
  if (!loadedEnv) {
    loadedEnv = envSchema.parse({
      client: process.env,
      server: process.env,
    });
  }
  return loadedEnv;
}

/**
 * @description /!\ Server ONLY env variables => do not leak it to the client
 */
export function loadServerEnv() {
  const env = loadEnv();

  return {
    ...env.server,
    ...env.client,
  };
}

/**
 * @description Use this to pass env variables to the client
 */
export function loadClientEnv() {
  return loadEnv().client;
}

export type ClientEnv = ReturnType<typeof loadClientEnv>;
