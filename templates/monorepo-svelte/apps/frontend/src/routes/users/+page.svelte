<script lang="ts">
  import { fetchUsers } from '$lib/api';
  import { UserPlus } from '@lucide/svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let extraPages = $state<(typeof data)[]>([]);
  let loading = $state(false);
  let loadError = $state<string | null>(null);

  const pages = $derived([data, ...extraPages]);
  const users = $derived(pages.flatMap((page) => page.users));
  const cursor = $derived(pages[pages.length - 1].nextCursor);

  async function loadMore() {
    if (!cursor) return;

    loading = true;
    loadError = null;

    try {
      extraPages = [...extraPages, await fetchUsers(cursor)];
    } catch (err) {
      loadError = err instanceof Error ? err.message : 'Failed to load users';
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Users</h1>
      <a
        href="/users/new"
        class="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
      >
        <UserPlus size={20} />
        Create New User
      </a>
    </div>

    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      {#if users.length === 0}
        <div class="p-8 text-center text-gray-500">
          <p class="text-lg mb-2">No users found</p>
          <p class="text-sm">Create your first user to get started.</p>
        </div>
      {:else}
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <p class="text-sm text-gray-600">Showing {users.length} items</p>
        </div>
        <div class="divide-y divide-gray-200">
          {#each users as user (user.id)}
            <div class="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    {user.name}
                    {user.surname}
                  </h3>
                  <p class="text-sm text-gray-600">{user.email}</p>
                </div>
                <div class="text-xs text-gray-400">
                  ID: {user.id.slice(0, 8)}...
                </div>
              </div>
            </div>
          {/each}
        </div>
        {#if cursor || loadError}
          <div class="px-6 py-4 border-t border-gray-200 text-center">
            {#if cursor}
              <button
                type="button"
                onclick={loadMore}
                disabled={loading}
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-cyan-700 bg-cyan-50 rounded-md hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Loading...' : 'Load more'}
              </button>
            {/if}
            {#if loadError}
              <p class="mt-2 text-sm text-red-600" role="alert">{loadError}</p>
            {/if}
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>
