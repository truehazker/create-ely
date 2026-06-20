import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { UserPlus } from 'lucide-react';
import { usersQueryOptions } from '@/features/users/queries';

export const Route = createFileRoute('/users/')({
  component: Users,
});

function Users() {
  const {
    data,
    error,
    isPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(usersQueryOptions);

  const users = data?.pages.flatMap((page) => page.users) ?? [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <Link
            to="/users/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
          >
            <UserPlus size={20} />
            Create New User
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isPending ? (
            <div className="p-8 text-center text-gray-500">
              Loading users...
            </div>
          ) : error && !data ? (
            <div className="p-8 text-center text-red-600">{error.message}</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg mb-2">No users found</p>
              <p className="text-sm">Create your first user to get started.</p>
            </div>
          ) : (
            <>
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {users.length} items
                </p>
              </div>
              <div className="divide-y divide-gray-200">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.name} {user.surname}
                        </h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {user.id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {(hasNextPage || error) && (
                <div className="px-6 py-4 border-t border-gray-200 text-center">
                  {hasNextPage && (
                    <button
                      type="button"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-cyan-700 bg-cyan-50 rounded-md hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isFetchingNextPage ? 'Loading...' : 'Load more'}
                    </button>
                  )}
                  {error && (
                    <p className="mt-2 text-sm text-red-600" role="alert">
                      {error.message}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
