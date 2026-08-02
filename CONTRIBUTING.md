# Contributing

## Project Structure

```text
templates/
├── backend -> monorepo/apps/backend  # Symlink (for standalone template)
├── monorepo/
│   ├── apps/
│   │   ├── backend/                  # Git submodule (elysia-boilerplate)
│   │   └── frontend/                 # React + TanStack Router
│   └── package.json
└── monorepo-svelte/
    ├── apps/
    │   ├── backend/                  # Git submodule (elysia-boilerplate)
    │   └── frontend/                 # SvelteKit + Svelte 5
    └── package.json
```

The backend is a **git submodule** pointing to [elysia-boilerplate](https://github.com/truehazker/elysia-boilerplate). Each monorepo template checks it out under its own `apps/backend`, so a backend bump means updating **both** submodules. The standalone backend template is a symlink to the submodule.

> **Why this structure?** Bun workspaces don't follow symlinks when resolving workspace packages. The submodule must be inside `apps/` for `bun install` to work in the monorepo during development.

## Setup

```bash
# Clone with submodules
git clone --recursive https://github.com/truehazker/create-ely

# Or if already cloned
git submodule update --init
```

## Versioning Strategy

| Repo | Version | Purpose |
| ---- | ------- | ------- |
| `create-ely` | Own version | CLI tool, frontend template, monorepo setup |
| `elysia-boilerplate` | Pinned tag | Backend template (submodule) |

The submodule is pinned to a **specific release tag** (e.g., `v0.4.4`). This ensures:

- **Stability** - Breaking changes in the boilerplate won't break the CLI
- **Control** - Updates are intentional and tested
- **Reproducibility** - Same CLI version always produces the same output

## Updating Backend Template

Both monorepo templates carry the submodule, so bump them together:

```bash
# Everything runs in a subshell so `set -e` never leaks into your own shell.
# A failed fetch or checkout aborts before the commit, so the two submodules
# can never land at different commits.
(
  set -e
  for t in monorepo monorepo-svelte; do
    git -C "templates/$t/apps/backend" fetch --tags
    git -C "templates/$t/apps/backend" checkout v0.5.0  # desired version
    git add "templates/$t/apps/backend"
  done
  git commit -m "chore: bump backend template to v0.5.0"
)
```

Always test after updating:

```bash
bun run src/index.ts
```

## Making Changes

| What | Where |
| ---- | ----- |
| Backend template | [elysia-boilerplate](https://github.com/truehazker/elysia-boilerplate) repo |
| React frontend template | `templates/monorepo/apps/frontend/` |
| Svelte frontend template | `templates/monorepo-svelte/apps/frontend/` |
| Monorepo config | `templates/<variant>/package.json` |
| CLI logic | `src/index.ts` |

## Development

```bash
bun install              # Install dependencies
bun run src/index.ts     # Test the CLI
bun run lint             # Lint
bun run build            # Build
```
