import type { Handle } from '@sveltejs/kit';

/**
 * SvelteKit hides response headers from SSR `fetch` unless they are allowlisted
 * here, and Eden reads `content-type` to decide how to parse the body.
 */
export const handle: Handle = ({ event, resolve }) =>
  resolve(event, {
    filterSerializedResponseHeaders: (name) => name === 'content-type',
  });
