import { fetchUsers } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ fetch }) => fetchUsers(undefined, fetch);
