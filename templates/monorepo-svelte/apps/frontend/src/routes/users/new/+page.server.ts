import { fail, redirect } from '@sveltejs/kit';
import { api } from '$lib/api';
import type { Actions } from './$types';

export const actions: Actions = {
  /**
   * Creates a user from the submitted form and redirects to the list.
   * @returns A `fail` with the submitted values when the backend rejects it
   */
  default: async ({ fetch, request }) => {
    const form = await request.formData();
    const body = {
      name: String(form.get('name') ?? ''),
      surname: String(form.get('surname') ?? ''),
      email: String(form.get('email') ?? ''),
    };

    const { error } = await api(fetch).users.post(body);

    if (error) {
      return fail(error.status, {
        ...body,
        message: error.value?.message ?? 'Failed to create user',
      });
    }

    redirect(303, '/users');
  },
};
