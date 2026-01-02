# Frontend Boilerplate

React boilerplate for ElysiaJS full-stack applications.

## Quick Start

```bash
bun install
bun run dev     # Start dev server on port 5173
bun run build   # Build for production
```

## Stack

- **React 19** with TypeScript
- **TanStack Router** - File-based routing in `src/routes/`
- **Tailwind CSS** - Styling with v4
- **Biome** - Linting & formatting
- **Vitest** - Testing

## Project Structure

```
src/
├── features/        # Feature modules (e.g., layout)
├── shared/          # Shared code
│   ├── components/  # Reusable UI components
│   ├── hooks/       # Custom hooks
│   ├── utils/       # Utilities
│   ├── types/       # Type definitions
│   └── constants/   # App constants
├── assets/          # Images, fonts, etc.
├── routes/          # File-based routes
└── main.tsx
```

## Commands

```bash
bun run dev        # Development server
bun run build      # Production build
bun run preview    # Preview production build
bun run test       # Run tests
bun run lint       # Lint code
bun run format     # Format code
bun run check      # Lint + format check
```

## Adding Routes

Create a new file in `src/routes/` - TanStack Router handles the rest automatically.

## Shadcn UI

Add components:

```bash
bunx shadcn@latest add button
```
