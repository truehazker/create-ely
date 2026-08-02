import { cleanup, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchUsers } from '$lib/api';
import ErrorPage from '../+error.svelte';
import UsersPage from './+page.svelte';
import NewUserPage from './new/+page.svelte';

vi.mock('$lib/api', () => ({ fetchUsers: vi.fn() }));
vi.mock('$app/forms', () => ({ enhance: () => ({ destroy() {} }) }));
vi.mock('$app/state', () => ({
  page: { status: 500, error: { message: 'Failed to load users' } },
}));

const mockFetchUsers = vi.mocked(fetchUsers);

const ADA = { id: 'u1', name: 'Ada', surname: 'Lovelace', email: 'ada@x.io' };
const ALAN = { id: 'u2', name: 'Alan', surname: 'Turing', email: 'alan@x.io' };

const page = (users: (typeof ADA)[], nextCursor: string | null) => ({
  users,
  nextCursor,
});

const listProps = (users: (typeof ADA)[], nextCursor: string | null) => ({
  data: page(users, nextCursor),
  params: {},
});

type ActionFailure = {
  name: string;
  surname: string;
  email: string;
  message: string;
};
const formProps = (form: ActionFailure | null) => ({
  form,
  data: {},
  params: {},
});

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(cleanup);

describe('/users (list)', () => {
  it('renders the first page of users', () => {
    render(UsersPage, { props: listProps([ADA], null) });

    expect(screen.getByText('Ada Lovelace')).toBeTruthy();
    expect(screen.getByText('ada@x.io')).toBeTruthy();
    expect(screen.getByText('Showing 1 items')).toBeTruthy();
  });

  it('appends the next page when Load more is clicked', async () => {
    mockFetchUsers.mockResolvedValue(page([ALAN], null));
    render(UsersPage, { props: listProps([ADA], 'u1') });

    await userEvent.click(screen.getByRole('button', { name: /load more/i }));

    expect(await screen.findByText('Alan Turing')).toBeTruthy();
    expect(screen.getByText('Ada Lovelace')).toBeTruthy();
    expect(mockFetchUsers).toHaveBeenCalledWith('u1');
  });

  it('hides Load more once the last page is loaded', async () => {
    mockFetchUsers.mockResolvedValue(page([ALAN], null));
    render(UsersPage, { props: listProps([ADA], 'u1') });

    await userEvent.click(screen.getByRole('button', { name: /load more/i }));

    await screen.findByText('Alan Turing');
    expect(screen.queryByRole('button', { name: /load more/i })).toBeNull();
  });

  it('shows the empty state when there are no users', () => {
    render(UsersPage, { props: listProps([], null) });

    expect(screen.getByText('No users found')).toBeTruthy();
  });

  it('keeps the loaded list visible when the next page fails', async () => {
    mockFetchUsers.mockRejectedValue(new Error('Next page failed'));
    render(UsersPage, { props: listProps([ADA], 'u1') });

    await userEvent.click(screen.getByRole('button', { name: /load more/i }));

    expect(await screen.findByRole('alert')).toHaveProperty(
      'textContent',
      'Next page failed',
    );
    expect(screen.getByText('Ada Lovelace')).toBeTruthy();
  });
});

describe('/users/new (create)', () => {
  it('posts the form to the action with the expected fields', () => {
    const { container } = render(NewUserPage, { props: formProps(null) });

    const form = container.querySelector('form');
    expect(form?.getAttribute('method')).toBe('POST');
    for (const field of ['name', 'surname', 'email']) {
      expect(container.querySelector(`input[name="${field}"]`)).toBeTruthy();
    }
  });

  it('shows the conflict message and keeps the submitted values (409)', () => {
    render(NewUserPage, {
      props: formProps({
        name: 'Alan',
        surname: 'Turing',
        email: 'dup@x.io',
        message: 'User could not be created due to a conflict',
      }),
    });

    expect(screen.getByRole('alert').textContent).toBe(
      'User could not be created due to a conflict',
    );
    expect(screen.getByLabelText('Email')).toHaveProperty('value', 'dup@x.io');
  });
});

describe('+error.svelte', () => {
  it('renders the status and message from a failed load', () => {
    render(ErrorPage);

    expect(screen.getByText('500')).toBeTruthy();
    expect(screen.getByText('Failed to load users')).toBeTruthy();
  });
});
