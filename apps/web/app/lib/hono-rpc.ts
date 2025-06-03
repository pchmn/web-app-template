import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';
import type { ClientResponse } from 'hono/client';
import type { StatusCode } from 'hono/utils/http-status';

export function createQueryOptions<T>(
  queryKey: QueryKey,
  query: Promise<ClientResponse<T, StatusCode, string>>,
  options?: Omit<
    UseQueryOptions<T, Error, T, QueryKey>,
    'queryKey' | 'queryFn'
  >,
) {
  return {
    ...(options ?? {}),
    queryKey,
    queryFn: () => query.then((res) => res.json() as T),
  };
}
