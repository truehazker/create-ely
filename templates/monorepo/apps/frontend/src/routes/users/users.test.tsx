import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { routeTree } from '@/routeTree.gen';
import { api } from '@/shared/api/client';

vi.mock('@tanstack/react-devtools', () => ({ TanStackDevtools: () => null }));
vi.mock('@tanstack/react-router-devtools', () => ({
  TanStackRouterDevtoolsPanel: () => null,
}));

vi.mock('@/shared/api/client', () => ({
  api: { users: { get: vi.fn(), post: vi.fn() } },
}));

const mockGet = vi.mocked(api.users.get);
const mockPost = vi.mocked(api.users.post);

type GetResult = Awaited<ReturnType<typeof api.users.get>>;
type PostResult = Awaited<ReturnType<typeof api.users.post>>;
const getOk = (data: NonNullable<GetResult['data']>) =>
  ({ data, error: null }) as unknown as GetResult;
const postOk = (data: NonNullable<PostResult['data']>) =>
  ({ data, error: null }) as unknown as PostResult;
const postErr = (error: NonNullable<PostResult['error']>) =>
  ({ data: null, error }) as unknown as PostResult;

const ALAN = { name: 'Alan', surname: 'Turing', email: 'alan@x.io' };

function renderAt(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

async function fillAndSubmitCreateForm(values: typeof ALAN) {
  const user = userEvent.setup();
  await user.type(await screen.findByLabelText('Name'), values.name);
  await user.type(screen.getByLabelText('Surname'), values.surname);
  await user.type(screen.getByLabelText('Email'), values.email);
  await user.click(screen.getByRole('button', { name: /create user/i }));
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(cleanup);

describe('/users (list)', () => {
  it('renders the first page of users', async () => {
    mockGet.mockResolvedValue(
      getOk({
        users: [
          { id: 'u1', name: 'Ada', surname: 'Lovelace', email: 'ada@x.io' },
        ],
        nextCursor: null,
      }),
    );

    renderAt('/users');

    expect(await screen.findByText('Ada Lovelace')).toBeTruthy();
    expect(screen.getByText('ada@x.io')).toBeTruthy();
  });

  it('appends the next page when Load more is clicked', async () => {
    mockGet
      .mockResolvedValueOnce(
        getOk({
          users: [
            { id: 'u1', name: 'Ada', surname: 'Lovelace', email: 'ada@x.io' },
          ],
          nextCursor: 'u1',
        }),
      )
      .mockResolvedValueOnce(
        getOk({
          users: [
            { id: 'u2', name: 'Alan', surname: 'Turing', email: 'alan@x.io' },
          ],
          nextCursor: null,
        }),
      );

    renderAt('/users');
    const user = userEvent.setup();
    await user.click(await screen.findByRole('button', { name: /load more/i }));

    expect(await screen.findByText('Alan Turing')).toBeTruthy();
    expect(screen.getByText('Ada Lovelace')).toBeTruthy();
    expect(mockGet).toHaveBeenLastCalledWith({
      query: expect.objectContaining({ cursor: 'u1' }),
    });
  });

  it('shows the empty state when there are no users', async () => {
    mockGet.mockResolvedValue(getOk({ users: [], nextCursor: null }));

    renderAt('/users');

    expect(await screen.findByText('No users found')).toBeTruthy();
  });

  it('shows an error when the initial load fails', async () => {
    mockGet.mockRejectedValue(new Error('Failed to load users'));

    renderAt('/users');

    expect(await screen.findByText('Failed to load users')).toBeTruthy();
  });

  it('keeps the loaded list visible when the next page fails', async () => {
    mockGet
      .mockResolvedValueOnce(
        getOk({
          users: [
            { id: 'u1', name: 'Ada', surname: 'Lovelace', email: 'ada@x.io' },
          ],
          nextCursor: 'u1',
        }),
      )
      .mockRejectedValueOnce(new Error('Next page failed'));

    renderAt('/users');
    const user = userEvent.setup();
    await user.click(await screen.findByRole('button', { name: /load more/i }));

    expect(await screen.findByText('Next page failed')).toBeTruthy();
    expect(screen.getByText('Ada Lovelace')).toBeTruthy();
  });
});

describe('/users/new (create)', () => {
  it('shows the conflict message when the email already exists (409)', async () => {
    mockPost.mockResolvedValue(
      postErr({
        status: 409,
        value: { message: 'User could not be created due to a conflict' },
      }),
    );

    renderAt('/users/new');
    await fillAndSubmitCreateForm({ ...ALAN, email: 'dup@x.io' });

    expect(
      await screen.findByText('User could not be created due to a conflict'),
    ).toBeTruthy();
  });

  it('submits the form payload to the API', async () => {
    mockPost.mockResolvedValue(postOk({ id: 'x', ...ALAN }));
    mockGet.mockResolvedValue(getOk({ users: [], nextCursor: null }));

    renderAt('/users/new');
    await fillAndSubmitCreateForm(ALAN);

    await waitFor(() => expect(mockPost).toHaveBeenCalledWith(ALAN));
  });
});
