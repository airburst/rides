# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # Dev server on port 3000
bun run build        # Production build (wrapper with timeout for prerender hang)
bun run check-types  # tsc --noEmit
bun test             # Run all tests (bun test runner)
bun test <file>      # Run single test file
bun run lint         # ESLint with --fix
bun run format       # Prettier
```

Pre-commit hook runs: lint, check-types, test.

## Architecture

Cycling club ride planner SPA. TanStack Start (SPA mode) + Vite + Bun. Deployed to Vercel as static SPA with `_shell.html` rewrite.

### Stack

- **Router**: TanStack Router with file-based routing (`src/routes/`). Route tree auto-generated in `src/routeTree.gen.ts` — do not edit manually.
- **UI**: React 19, DaisyUI 5, Tailwind CSS 4. Custom themes defined in `src/styles/globals.css`.
- **State**: TanStack Query for all server state. React Context for UI state (`FilterContext`). `useLocalStorage` hook for persistent preferences.
- **Forms**: react-hook-form + zod (via @hookform/resolvers)
- **Auth**: Auth0 via `@auth0/auth0-react`. Provider wraps app in `src/components/Providers.tsx`.
- **Backend**: External Hono API. All data fetching goes through `apiClient()` in `src/lib/api.ts`.

### Key Data Flow

- `useApiClient()` hook wraps `apiClient()` with Auth0 token injection
- `useSession()` fetches current user from `/users/me` after Auth0 auth, handles token errors
- Domain hooks organized in `src/hooks/rides/`, `src/hooks/repeating-rides/`, `src/hooks/users/` — each with barrel `index.ts` and `types.ts`
- Shared utilities in `shared/utils/` (aliased as `@utils/*`)

### Path Aliases

- `@/*` → `./src/*`
- `@components/*` → `./src/components/*`
- `@utils/*` → `./shared/utils/*`

### Env Vars

`VITE_*` prefix, accessed via `import.meta.env.VITE_*`. Validated in `src/env.ts` with zod. Key vars: `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE`, `VITE_API_URL`.

## Code Conventions

- TypeScript strict mode with `noUncheckedIndexedAccess`
- Prefer `type` imports: `import { type Foo } from ...` (enforced by ESLint)
- Test files (`*.test.ts`) excluded from tsconfig — use bun test globals, not vitest
- No `"use client"` directives (pure SPA, not SSR)
- Dialogs: `@base-ui/react/dialog` pattern
- Icons: `lucide-react`
- Toasts: `sonner`
- Types defined in `src/types/index.ts` (Ride, User, RepeatingRide, etc.)
- Multi-club support via env vars and theme files in `src/themes/`

## Commits & PRs

Before committing, run the pre-commit hooks manually to verify: `bun run lint && bun run check-types && bun test`

Before creating a PR:

1. Bump `version` in `package.json` using semver (patch for fixes, minor for features, major for breaking changes)
2. Add an entry to `CHANGELOG.md` following the [Keep a Changelog](http://keepachangelog.com/) format with date (`## X.Y.Z - YYYY-MM-DD`) and sections: Added, Changed, Fixed, Technical as appropriate
