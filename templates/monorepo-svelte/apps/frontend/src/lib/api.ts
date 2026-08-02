import { treaty } from '@elysiajs/eden';
import type { App } from 'elysia-boilerplate';
import { env } from '$env/dynamic/public';

const PAGE_SIZE = 10;

/**
 * Pass the `fetch` from a load function or action so SvelteKit can dedupe the
 * SSR request instead of refetching it on the client.
 */
export const api = (fetcher: typeof fetch = fetch) =>
  treaty<App>(env.PUBLIC_API_URL || 'http://localhost:3000', { fetcher });

/**
 * Fetches one page of users from the backend.
 * @param cursor - Cursor of the last seen user, omit for the first page
 * @param fetcher - SvelteKit's `fetch`, so SSR requests are deduped
 * @returns The page payload
 * @throws When the backend answers with an error status
 */
export async function fetchUsers(cursor?: string, fetcher?: typeof fetch) {
  const { data, error } = await api(fetcher).users.get({
    query: cursor ? { limit: PAGE_SIZE, cursor } : { limit: PAGE_SIZE },
  });

  if (error) {
    // The backend answers with a bare string (500) or `{ message }` (handled errors).
    const detail =
      typeof error.value === 'string' ? error.value : error.value?.message;
    throw new Error(`Failed to load users (${error.status}): ${detail}`);
  }

  return data;
}
