<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageProps } from './$types';

  let { form }: PageProps = $props();

  let submitting = $state(false);

  const submit = () => {
    submitting = true;
    return async ({ update }: { update: () => Promise<void> }) => {
      try {
        await update();
      } finally {
        submitting = false;
      }
    };
  };

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Create New User</h1>

    {#if form?.message}
      <div
        role="alert"
        class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
      >
        <p class="text-sm text-red-800">{form.message}</p>
      </div>
    {/if}

    <form method="POST" use:enhance={submit} class="space-y-4">
      <div>
        <label for="name" class={labelClass}>Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={form?.name ?? ''}
          required
          minlength="1"
          maxlength="255"
          class={inputClass}
          disabled={submitting}
        />
      </div>

      <div>
        <label for="surname" class={labelClass}>Surname</label>
        <input
          type="text"
          id="surname"
          name="surname"
          value={form?.surname ?? ''}
          required
          minlength="1"
          maxlength="255"
          class={inputClass}
          disabled={submitting}
        />
      </div>

      <div>
        <label for="email" class={labelClass}>Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form?.email ?? ''}
          required
          minlength="1"
          maxlength="255"
          class={inputClass}
          disabled={submitting}
        />
      </div>

      <div class="flex gap-3 pt-4">
        <a
          href="/users"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 text-center"
        >
          Cancel
        </a>
        <button
          type="submit"
          class="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitting}
        >
          {submitting ? 'Creating...' : 'Create User'}
        </button>
      </div>
    </form>
  </div>
</div>
