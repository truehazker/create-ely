import { fetchUsers } from '$lib/api';
import type { PageLoad } from './$types';

/**
 * Loads the first page of users for the list route.
 */
export const load: PageLoad = ({ fetch }) => fetchUsers(undefined, fetch);
