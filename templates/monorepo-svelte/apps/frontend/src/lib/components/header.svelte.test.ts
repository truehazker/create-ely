import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import Header from './Header.svelte';

vi.mock('$app/state', () => ({ page: { url: new URL('http://localhost/') } }));

// Svelte sets `inert` as a DOM property rather than an attribute, so assert on
// the property — `hasAttribute('inert')` is false even when the drawer is inert.
test('the closed drawer is inert, so its links stay out of the tab order', async () => {
  const { container } = render(Header);
  const drawer = container.querySelector('aside') as HTMLElement;

  expect(drawer.inert).toBe(true);

  await userEvent.click(screen.getByRole('button', { name: /open menu/i }));

  expect(drawer.inert).toBe(false);
});
