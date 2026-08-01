/// <reference types="vitest/config" />
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    port: 5173,
  },
  test: {
    projects: [
      {
        // Component tests: need the browser build of Svelte and jsdom.
        extends: true,
        resolve: { conditions: ['browser'] },
        test: {
          name: 'client',
          environment: 'jsdom',
          include: ['src/**/*.svelte.{test,spec}.ts'],
        },
      },
      {
        // Load functions and form actions run on the server.
        extends: true,
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.{test,spec}.ts'],
          exclude: ['src/**/*.svelte.{test,spec}.ts'],
        },
      },
    ],
  },
});
