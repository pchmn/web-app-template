import { useQuery } from '@tanstack/react-query';
import { rpcClient } from '~/lib/rpc/rpc-client';
import { authClient } from '~/modules/auth/auth-client';
import type { Route } from './+types/dashboard';

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { data: session, isPending } = authClient.useSession();

  // console.log({ session });

  // console.log('[_index] window is defined', typeof window !== 'undefined');

  const { data } = useQuery({
    queryKey: ['privateData'],
    queryFn: () =>
      rpcClient.private.$get().then(async (res) => await res.json()),
  });

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session?.user.name}</p>
      <p>privateData: {data?.user?.email}</p>
    </div>
  );
}
