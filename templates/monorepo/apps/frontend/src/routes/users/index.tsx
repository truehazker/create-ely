import { createFileRoute } from '@tanstack/react-router';
import { api } from '@/shared/api/client';

export const Route = createFileRoute('/users/')({
  component: Users,
});

async function Users() {
  const { data, error } = await api.users.get({
    query: {
      limit: 10,
      offset: 0,
    },
  });

  if (error) {
    return <div>Error: {error.value}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <h1 className="text-5xl font-bold mb-4">Welcome</h1>
        <p>
          Edit <code>src/routes/index.tsx</code> and save to reload.
        </p>
        <a
          className="text-[#61dafb] hover:underline"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <a
          className="text-[#61dafb] hover:underline"
          href="https://tanstack.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn TanStack
        </a>
      </header>
    </div>
  );
}
