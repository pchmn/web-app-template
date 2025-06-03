import { Button } from '@web-app-template/ui/button';
import { Flex } from '@web-app-template/ui/flex';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { ModeToggle } from '~/components/mode-toggle';
import { getQueryClient } from '~/lib/react-query/query-client';
import { rpcClient } from '~/lib/rpc/rpc-client';
import { createQueryOptions } from '~/lib/rpc/rpc-utils';
import { authClient } from '~/modules/auth/auth-client';
import { SESSION_QUERY_KEY, useSession } from '~/modules/auth/useSession';
import { useSignOut } from '~/modules/auth/useSignOut';
import type { Route } from './+types/_index';

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
export function meta({}: Route.MetaArgs) {
  return [{ title: 'My App' }, { name: 'description', content: 'My App' }];
}

export async function clientLoader() {
  const { data: session } = await authClient.getSession();

  getQueryClient().setQueryData(SESSION_QUERY_KEY, session);
}

export default function Home() {
  const healthCheck = useQuery(
    createQueryOptions(['healthCheck'], rpcClient.health.$get()),
  );
  const { session } = useSession();
  const { signOut } = useSignOut();

  return (
    <div className='container mx-auto max-w-3xl px-4 py-2'>
      <div className='grid gap-6'>
        <section className='rounded-lg bg-accent/75 p-4'>
          <h2 className='mb-2 font-medium'>API Status</h2>
          <div className='flex items-center gap-2'>
            <div
              className={`h-2 w-2 rounded-full ${
                healthCheck.data ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className='text-muted-foreground text-sm'>
              {healthCheck.isLoading
                ? 'Checking...'
                : healthCheck.data
                  ? 'Connected'
                  : 'Disconnected'}
            </span>
          </div>
        </section>
      </div>

      {session ? (
        <Flex className='mt-4 gap-2'>
          <span>{session.user.name}</span>
          <Button variant='outline' onClick={() => signOut()}>
            Sign Out
          </Button>

          <Button asChild>
            <Link to='/dashboard'>Dashboard</Link>
          </Button>

          <ModeToggle />
        </Flex>
      ) : (
        <Button className='mt-4' asChild>
          <Link to='/sign-in'>Sign In</Link>
        </Button>
      )}
    </div>
  );
}
