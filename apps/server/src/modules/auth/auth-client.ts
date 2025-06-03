import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '~/db';
import * as schema from '~/db/schema/auth';

export const authClient = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  basePath: '/auth',
  trustedOrigins: [process.env.CORS_ORIGIN || ''],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});

// Only for better-auth cli
// export const auth = authClient;
