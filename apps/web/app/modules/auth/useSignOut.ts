import { useMutation } from '@tanstack/react-query';
import { getQueryClient } from '~/lib/react-query/query-client';
import { authClient } from './auth-client';
import { SESSION_QUERY_KEY } from './useSession';

export function useSignOut() {
  const { mutate, ...rest } = useMutation({
    mutationFn: async () => {
      await authClient.signOut();
      getQueryClient().setQueryData(SESSION_QUERY_KEY, null);
    },
  });

  return {
    signOut: mutate,
    ...rest,
  };
}
