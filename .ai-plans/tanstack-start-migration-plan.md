# TanStack Start Migration Plan

Migrate this T3-stack ride management app from Next.js 16 to TanStack Start incrementally (Next.js on port 3000, TanStack Start on port 3001). Use Better Auth with custom roles, preserve all user data, and add test coverage.

---

## Phase 1: Foundation & Parallel Setup (1-2 weeks)

1. Install TanStack Start, Router, Query, and Vinxi alongside existing Next.js—both apps share `src/server/db/` and `src/components/`
2. Create new `app/` directory with TanStack Start entry points (`app/router.tsx`, `app/routes/__root.tsx`) running on port 3001
3. Replace `@t3-oss/env-nextjs` with `@t3-oss/env-core` in `src/env.js` for framework-agnostic env handling
4. Configure Vinxi/Nitro server in new `app.config.ts` with shared PostgreSQL connection from `src/server/db/index.ts`
5. Port global layout, fonts (Outfit), and Tailwind/DaisyUI styling to TanStack Start's root route

## Phase 2: Authentication with Better Auth (1 week)

1. Install `better-auth` and `@better-auth/drizzle`, configure in new `src/server/better-auth.ts`
2. Create Drizzle migration adding Better Auth tables: `ba_user`, `ba_session`, `ba_account`
3. Extend user schema with `role` field (enum: `admin`, `leader`, `member`) defaulting to `member` for new users
4. Write migration script to copy existing users from `users` table to Better Auth user table, preserving role mapping: `ADMIN` → `admin`, `LEADER` → `leader`, `USER` → `member`
5. Configure Auth0 OAuth provider via `socialProviders.auth0`
6. Create `getSession()` helper and `assertRole()` authorization utility for server functions

## Phase 3: Core Routes & Data Fetching (2-3 weeks)

1. Create root route (`/`) showing rides list for all users (authenticated and unauthenticated), with login button linking to Auth0
2. Implement routes in TanStack Router: `/rides`, `/ride/:id`, `/ride/new`, `/calendar`, `/profile`, `/users`
3. Convert routes incrementally, starting with read-only pages (`src/app/page.tsx` → `app/routes/index.tsx`)
4. Replace Server Actions in `src/server/actions/` with TanStack Server Functions using `createServerFn()`
5. Implement TanStack Query for data fetching, replacing `revalidatePath()` with `queryClient.invalidateQueries()`
6. Add role-based authorization checks: `leader` and `admin` can create/edit rides, `admin` can manage users
7. Convert `loading.tsx` to route-level `pendingComponent`, `not-found.tsx` to `notFoundComponent`

## Phase 4: Client Components & State (1 week)

1. Replace `next/link` with TanStack Router `<Link>` across 10+ component usages
2. Replace `next/navigation` hooks (`useRouter`, `usePathname`, `useParams`) with TanStack Router equivalents
3. Convert `next/dynamic` imports (15+ usages) to React `lazy()` + `<Suspense>`
4. Preserve Jotai atoms in `src/store/` but update optimistic update hooks to use TanStack Query mutations
5. Remove `next/image` usages—replace with standard `<img>` tags for avatars

## Phase 5: API Routes & Cron Jobs (3-5 days)

1. Convert `/api/generate`, `/api/riderhq`, `/api/archive-rides` to TanStack Start API routes using Nitro handlers
2. Preserve `CRON_SECRET` authorization pattern for scheduled jobs

## Phase 6: Test Coverage (1-2 weeks)

1. Install Playwright and configure in `playwright.config.ts` to run against local TanStack Start app on port 3001 with test database
2. Configure test database via `DATABASE_URL` override, seeded using `bin/seed` (update seed to create test users with each role)
3. Write critical path e2e tests: unauthenticated rides list view, authentication flow, create/edit/delete ride, join/leave ride, calendar navigation
4. Add e2e tests for role-based access: leader can create rides, member cannot; admin can manage users
5. Add unit tests for `shared/utils/` and `src/components/Filters/`

## Phase 7: Cleanup & Deployment (3-5 days)

1. Remove Next.js dependencies (`next`, `next-auth`, `@next-auth/drizzle-adapter`, `@t3-oss/env-nextjs`)
2. Delete `src/app/` directory, `next.config.js`, and NextAuth tables from schema
3. Update `package.json` scripts: replace `next dev/build/start` with Vinxi equivalents
4. Configure Vercel deployment for TanStack Start—users re-login after cutover
