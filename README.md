# create-ely

Scaffold ElysiaJS projects with ease using [Bun](https://bun.sh).

## Usage

Create a new ElysiaJS project:

```bash
bunx create-ely my-project
```

You'll be prompted to choose between:

- **Backend only** - ElysiaJS API with PostgreSQL, Drizzle ORM
- **Monorepo** - Backend + Frontend (React with TanStack Router)

## Templates

### Backend Only

A production-ready ElysiaJS backend with:

- PostgreSQL database with Drizzle ORM
- Type-safe API with OpenAPI documentation
- Global error handling
- Structured logging with Pino
- Docker support
- Environment validation

### Monorepo

Full-stack setup with:

- Backend: Everything from Backend Only template
- Frontend: React + TanStack Router + Vite
- Workspace configuration with Bun

## Development

To test the CLI locally:

```bash
bun link
bunx create-ely
```

## License

MIT
