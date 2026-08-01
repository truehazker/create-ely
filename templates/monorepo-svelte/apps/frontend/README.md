# Frontend Boilerplate

SvelteKit boilerplate for ElysiaJS full-stack applications.

## Quick Start

```bash
bun install
bun run dev     # Start dev server on port 5173
bun run build   # Build for production
```

## Environment Variables

Copy `.env.example` to `.env`:

```bash
PUBLIC_API_URL=http://localhost:3000
```

## Stack

- **Svelte 5** with TypeScript and runes
- **SvelteKit** - File-based routing in `src/routes/`
- **Eden Treaty** - End-to-end typed client for the ElysiaJS backend
- **Tailwind CSS** - Styling with v4
- **Biome** - Linting & formatting
- **Vitest** - Component tests (`*.svelte.test.ts`, jsdom) and server tests
  (`*.test.ts`, node) run as separate projects

## Project Structure

```text
src/
├── lib/
│   ├── components/  # Reusable components
│   └── api.ts       # Eden Treaty client + data fetching
├── routes/          # File-based routes
├── app.css          # Tailwind entry
└── app.html         # HTML shell
```

## Commands

```bash
bun run dev        # Development server
bun run build      # Production build
bun run preview    # Preview production build
bun run test       # Run tests
bun run check      # Type-check with svelte-check
bun run lint       # Lint code
bun run format     # Format code
```

## Adding Routes

Create a `+page.svelte` in a new folder under `src/routes/` - SvelteKit handles
the rest. Add `+page.ts` to load data and `+page.server.ts` for form actions.
