import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      // Lets the backend's own `src/*` imports resolve when Eden infers the App type.
      src: '../backend/src',
    },
  },
};
