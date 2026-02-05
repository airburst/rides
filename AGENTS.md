# AI Agent Guidelines

## Project Overview

This is a Next.js application for a cycling club ride planner. It uses:

- Next.js with App Router (hybrid: client components for migrated features, server components for admin)
- TypeScript with strict type checking
- **TanStack Query** for data fetching and state management (replaced Jotai)
- **Auth0 SPA SDK** for authentication
- External Hono API (https://api.fairhursts.net) for backend
- React with dynamic imports
- Environment variables for configuration

## Architecture (Migration in Progress)

**Migrated Features (Client-side):**

- Rides list, details, join/leave, notes → TanStack Query + external API
- Auth → Auth0 SPA SDK

**Pending Migration (Server-side):**

- Calendar, Profile, Repeating Rides, Ride Forms → still use server actions

## State Management

- **TanStack Query** - all server state, caching, optimistic updates
- **React Context** - UI state (e.g., FilterContext for filter menu)
- **localStorage** via `useLocalStorage` hook - persistent preferences
- ❌ **No Jotai** - fully removed

## Code Style

- Use TypeScript with strict type checking
- Prefer functional components with hooks
- Client components: mark with `"use client"` directive
- Use dynamic imports for code splitting where appropriate
- Follow Next.js App Router conventions (page.tsx, layout.tsx, etc.)
- Components are organized under `src/components/`
- Use path aliases (`@/`) for imports

## File Structure

```
src/
  app/          # Next.js App Router pages
  components/   # React components
  contexts/     # React contexts (FilterContext, etc.)
  hooks/        # Custom hooks (useRides, useSession, etc.)
  lib/          # Utilities (api.ts for API client)
  env.js        # Environment configuration
```

## Data Fetching

- **Client components:** Use TanStack Query hooks from `src/hooks/`
  - `useRides()`, `useRide()`, `useJoinRide()`, `useLeaveRide()`, `useUpdateNotes()`
- **Optimistic updates:** Built into TanStack Query mutations (`onMutate`, `onError`, `onSettled`)
- **API client:** Use `apiClient()` from `@/lib/api` or `useApiClient()` hook

## Testing

- Run `yarn test` before committing changes
- Ensure TypeScript compiles: `yarn check-types`
- Build must succeed: `yarn build`
- Auth0 env vars are optional in test environment

## Environment Variables

- Public env vars prefixed with `NEXT_PUBLIC_`
- Access via `@/env` module
- Required: `NEXT_PUBLIC_AUTH0_*`, `NEXT_PUBLIC_API_URL` (except in tests)

## Commit Guidelines

- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Pre-commit hooks run: lint, type-check, test
