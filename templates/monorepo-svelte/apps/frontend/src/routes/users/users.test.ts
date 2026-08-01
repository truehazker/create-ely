import { expect, test, vi } from 'vitest';
import { fetchUsers } from '$lib/api';
import { actions } from './new/+page.server';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const stubFetch = (response: Response) =>
  vi.fn(() => Promise.resolve(response)) as unknown as typeof fetch &
    ReturnType<typeof vi.fn>;

const createRequest = () => {
  const body = new FormData();
  body.set('name', 'Ada');
  body.set('surname', 'Lovelace');
  body.set('email', 'ada@example.com');
  return new Request('http://localhost/users/new', { method: 'POST', body });
};

// biome-ignore lint/suspicious/noExplicitAny: action events are stubbed, not built
const runAction = (event: any) => actions.default(event);

test('fetchUsers forwards the cursor and page size', async () => {
  const fetcher = stubFetch(json({ users: [], nextCursor: null }));

  await fetchUsers('01234567-89ab-7def-8123-456789abcdef', fetcher);

  const url = new URL(String(fetcher.mock.calls[0][0]));
  expect(url.searchParams.get('cursor')).toBe(
    '01234567-89ab-7def-8123-456789abcdef',
  );
  expect(url.searchParams.get('limit')).toBe('10');
});

test('fetchUsers surfaces the status and the error message', async () => {
  const fetcher = stubFetch(json({ message: 'nope' }, 500));

  await expect(fetchUsers(undefined, fetcher)).rejects.toThrow(
    'Failed to load users (500): nope',
  );
});

test('fetchUsers surfaces a plain-text error body', async () => {
  const fetcher = stubFetch(
    new Response('Internal Server Error', {
      status: 500,
      headers: { 'content-type': 'text/plain' },
    }),
  );

  await expect(fetchUsers(undefined, fetcher)).rejects.toThrow(
    'Failed to load users (500): Internal Server Error',
  );
});

test('create action returns the conflict message', async () => {
  const fetcher = stubFetch(
    json({ message: 'User could not be created due to a conflict' }, 409),
  );

  const result = await runAction({ fetch: fetcher, request: createRequest() });

  expect(result).toMatchObject({
    status: 409,
    data: { message: 'User could not be created due to a conflict' },
  });
});

test('create action redirects to the list on success', async () => {
  const fetcher = stubFetch(
    json({ id: '1', name: 'Ada', surname: 'Lovelace', email: 'a@b.co' }),
  );

  await expect(
    runAction({ fetch: fetcher, request: createRequest() }),
  ).rejects.toMatchObject({ status: 303, location: '/users' });
});
