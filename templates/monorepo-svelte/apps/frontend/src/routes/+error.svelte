<script lang="ts">
  import { page } from '$app/state';
</script>

<div
  class="min-h-screen flex flex-col items-center justify-center gap-2 bg-gray-50"
>
  <h1 class="text-3xl font-bold text-gray-900">{page.status}</h1>
  <p class="text-gray-600">{page.error?.message}</p>
  <a href="/" class="text-cyan-700 hover:underline">Go home</a>
</div>
