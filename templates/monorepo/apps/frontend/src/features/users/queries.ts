import { infiniteQueryOptions } from '@tanstack/react-query';
import { api } from '@/shared/api/client';

const PAGE_SIZE = 10;

async function fetchUsers(cursor?: string) {
  const { data, error } = await api.users.get({
    query: cursor ? { limit: PAGE_SIZE, cursor } : { limit: PAGE_SIZE },
  });
  if (error) {
    throw new Error(error.value?.message ?? 'Failed to load users');
  }
  return data;
}

export const usersQueryOptions = infiniteQueryOptions({
  queryKey: ['users'],
  queryFn: ({ pageParam }: { pageParam?: string }) => fetchUsers(pageParam),
  initialPageParam: undefined,
  getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
});
