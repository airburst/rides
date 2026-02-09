# Migrate Next.js to TanStack Start (SPA mode) + Bun

## Context

The app is a 100% client-side rendered cycling club ride planner using Next.js 16 as a build framework only — no SSR, no API routes, no server components. Migrating to TanStack Start (SPA mode) + Bun reduces framework overhead, eliminates unnecessary server runtime on Vercel, and aligns with the team's preferred stack (reference: `../admin-app`).

**Vercel supports TanStack Start** — [official docs](https://vercel.com/docs/frameworks/full-stack/tanstack-start). SPA mode generates static `_shell.html` + client assets, deployable as static files (no function invocations needed).

---

## Phase 1: Project scaffold — config files + dependencies

**Replace package manager & dependencies:**

- Remove `yarn.lock`, `.yarnrc.yml`, `.yarn/` dir
- Create new `package.json` with:
  - Bun as package manager
  - Remove: `next`, `sharp`, `@next/*`, `@t3-oss/env-nextjs`, `eslint-config-next`, `jest`, `jest-environment-jsdom`, `@tailwindcss/postcss`, `autoprefixer`, `postcss`, `@headlessui/react`
  - Add: `@tanstack/react-router`, `@tanstack/react-start`, `@tanstack/router-plugin`, `nitro`, `vite`, `@vitejs/plugin-react`, `vite-tsconfig-paths`, `@tailwindcss/vite`, `vitest`, `jsdom`, `@tanstack/react-router-devtools`, `@tanstack/devtools-vite`
  - Add: `@base-ui/react`
  - Keep: all app deps (`@auth0/auth0-react`, `@tanstack/react-query`, `react-hook-form`, `zod`, `dayjs`, `rrule`, `daisyui`, `tailwindcss`, `lucide-react`, `sonner`, `clsx`, `markdown-it`, `turndown`)
- `bun install`

**New config files:**

- `vite.config.ts` — based on admin-app pattern, with `tanstackStart({ spa: { enabled: true } })`, `nitro()`, `tailwindcss()`, `viteTsConfigPaths()`, `viteReact()`
- Update `tsconfig.json` — remove `next` plugin, remove `.next` includes, keep path aliases

**Remove Next.js config files:**

- `next.config.js`
- `postcss.config.cjs` (Tailwind v4 via Vite plugin instead)
- `next-env.d.ts`

**Update scripts in package.json:**

```json
"dev": "vite dev --port 3000",
"build": "vite build",
"preview": "vite preview",
"test": "vitest run",
"lint": "eslint --fix",
"check-types": "tsc --noEmit"
```

**Files to create/modify:**

- `package.json` — rewrite
- `vite.config.ts` — new
- `tsconfig.json` — update
- Delete: `next.config.js`, `postcss.config.cjs`

---

## Phase 2: Entry points + root route

**Create TanStack Start entry points:**

- `src/router.tsx` — `createRouter()` with `routeTree`, scroll restoration, pending config (copy pattern from admin-app `src/router.tsx`)
- `src/routes/__root.tsx` — root route with:
  - `shellComponent`: HTML wrapper (`<html>`, `<head>`, `<body>`, `<Scripts>`)
  - `head()`: meta tags, favicon links, manifest, Google Fonts CSS link (replaces `next/font/google`)
  - `component`: `<Providers>` + `<Header>` + `<Outlet>` + `<Toaster>` (replaces `src/app/layout.tsx`)
  - `notFoundComponent`: replaces `src/app/not-found.tsx`
  - `pendingComponent`: replaces `src/app/loading.tsx`

**Font migration:**

- Replace `next/font/google` (Outfit) with Google Fonts CDN `<link>` in `head()` or `@fontsource-variable/outfit`

**Files to create:**

- `src/router.tsx`
- `src/routes/__root.tsx`

**Files to delete:**

- `src/app/layout.tsx`
- `src/app/not-found.tsx`
- `src/app/loading.tsx`

---

## Phase 3: Environment variables

**Rename all env vars** from `NEXT_PUBLIC_*` to `VITE_*`:

- `NEXT_PUBLIC_CLUB_LONG_NAME` → `VITE_CLUB_LONG_NAME`
- `NEXT_PUBLIC_CLUB_SHORT_NAME` → `VITE_CLUB_SHORT_NAME`
- `NEXT_PUBLIC_REPO` → `VITE_REPO`
- `NEXT_PUBLIC_AUTH0_DOMAIN` → `VITE_AUTH0_DOMAIN`
- `NEXT_PUBLIC_AUTH0_CLIENT_ID` → `VITE_AUTH0_CLIENT_ID`
- `NEXT_PUBLIC_AUTH0_AUDIENCE` → `VITE_AUTH0_AUDIENCE`
- `NEXT_PUBLIC_API_URL` → `VITE_API_URL`

**Replace `@t3-oss/env-nextjs`** — rewrite `src/env.js` → `src/env.ts` using plain Zod validation against `import.meta.env`:

```ts
import { z } from "zod";
const schema = z.object({ VITE_API_URL: z.string().url(), ... });
export const env = schema.parse(import.meta.env);
```

**Replace all `process.env.NEXT_PUBLIC_*`** refs with `import.meta.env.VITE_*`:

- `src/components/Providers.tsx` (3 refs)
- `src/components/Header/Header.tsx` (1 ref)
- `src/lib/api.ts` (1 ref)

**Update `.env.example`** and `.env` with new var names. Update Vercel dashboard env vars.

**Files to modify:**

- `src/env.js` → rename to `src/env.ts`, rewrite
- `src/components/Providers.tsx`
- `src/components/Header/Header.tsx`
- `src/lib/api.ts`
- `.env.example`, `.env`

---

## Phase 4: Route migration

Convert Next.js App Router pages → TanStack Router file routes. All routes use catch-all `[...id]` but only access index `[0]`, so they become simple `$id` params.

**Route mapping:**

| Next.js path                                    | TanStack Router file                      | Param  |
| ----------------------------------------------- | ----------------------------------------- | ------ |
| `src/app/page.tsx`                              | `src/routes/index.tsx`                    | —      |
| `src/app/rides/[...date]/page.tsx`              | `src/routes/rides/$date.tsx`              | `date` |
| `src/app/ride/[...id]/page.tsx`                 | `src/routes/ride/$id.tsx`                 | `id`   |
| `src/app/ride/new/page.tsx`                     | `src/routes/ride/new/index.tsx`           | —      |
| `src/app/ride/new/[...date]/page.tsx`           | `src/routes/ride/new/$date.tsx`           | `date` |
| `src/app/ride/edit/[...id]/page.tsx`            | `src/routes/ride/edit/$id.tsx`            | `id`   |
| `src/app/ride/copy/[...id]/page.tsx`            | `src/routes/ride/copy/$id.tsx`            | `id`   |
| `src/app/calendar/page.tsx`                     | `src/routes/calendar/index.tsx`           | —      |
| `src/app/calendar/[...date]/page.tsx`           | `src/routes/calendar/$date.tsx`           | `date` |
| `src/app/repeating-rides/page.tsx`              | `src/routes/repeating-rides/index.tsx`    | —      |
| `src/app/repeating-rides/[...id]/page.tsx`      | `src/routes/repeating-rides/$id.tsx`      | `id`   |
| `src/app/repeating-rides/edit/[...id]/page.tsx` | `src/routes/repeating-rides/edit/$id.tsx` | `id`   |
| `src/app/repeating-rides/copy/[...id]/page.tsx` | `src/routes/repeating-rides/copy/$id.tsx` | `id`   |
| `src/app/users/page.tsx`                        | `src/routes/users.tsx`                    | —      |
| `src/app/profile/page.tsx`                      | `src/routes/profile/index.tsx`            | —      |
| `src/app/profile/[...id]/page.tsx`              | `src/routes/profile/$id.tsx`              | `id`   |

**Each route file pattern:**

```tsx
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/ride/$id")({
  component: RideDetailsPage,
  pendingComponent: RideDetailsSkeleton, // replaces loading.tsx
});
function RideDetailsPage() {
  const { id } = Route.useParams();
  return <RideDetailsClient id={id} />;
}
```

**Calendar sub-layout** (`src/app/calendar/layout.tsx`):

- Create `src/routes/calendar.tsx` as layout route with `<div className="w-full"><Outlet /></div>` only — **no Toaster** (root layout already has one; current Next.js code has duplicate Toasters)
- Calendar child routes become `src/routes/calendar/index.tsx` and `src/routes/calendar/$date.tsx`

**Page metadata** (`export const metadata`):

- Move to `head()` function in each route's `createFileRoute()` config, or consolidate to `__root.tsx` since most pages share the same title

**Delete after migration:**

- Entire `src/app/` directory
- All `loading.tsx` files (replaced by `pendingComponent`)

---

## Phase 5: Replace Next.js-specific imports

### `next/link` → TanStack Router `<Link>`

~8 files: `Header.tsx`, `RideGroup.tsx`, `RepeatingRideCard.tsx`, `UsersList.tsx`, `MenuEntry.tsx`, `Day.tsx`, plus calendar/rides pages

```tsx
// Before
import Link from "next/link";
<Link href={`/ride/${id}`}>

// After
import { Link } from "@tanstack/react-router";
<Link to="/ride/$id" params={{ id }}>
```

### `next/navigation` → TanStack Router hooks

~14 files using `useRouter`, `usePathname`, `useParams`

```tsx
// useRouter().push() → useNavigate()
import { useNavigate } from "@tanstack/react-router";
const navigate = useNavigate();
navigate({ to: "/ride/$id", params: { id } });

// useRouter().back() → window.history.back() or useRouter()
import { useRouter } from "@tanstack/react-router";
const router = useRouter();
router.history.back();

// usePathname() → useLocation()
import { useLocation } from "@tanstack/react-router";
const { pathname } = useLocation();

// useParams() → Route.useParams() (in route files) or useParams from router
```

### `next/dynamic` → `React.lazy` + `Suspense`

~15 files using dynamic imports

```tsx
// Before
import dynamic from "next/dynamic";
const RideForm = dynamic(() => import("@/components/forms/RideForm"), {
  ssr: false,
});

// After
import { lazy, Suspense } from "react";
const RideForm = lazy(() => import("@/components/forms/RideForm"));
// Wrap usage in <Suspense fallback={...}> if not already
```

### `next/image` → `<img>`

~5 files: `Header.tsx`, `RideCard.tsx`, `CardSkeleton.tsx`, `ImageUpload.tsx`, `UserProfileForm.tsx`

```tsx
// Before
import Image from "next/image";
<Image src={url} width={40} height={40} alt="..." />

// After
<img src={url} width={40} height={40} alt="..." />
```

### `Metadata` type imports

~4 files — remove, replaced by `head()` in route definitions

---

## Phase 5b: Migrate Headless UI → Base UI

Replace `@headlessui/react` components with `@base-ui/react` equivalents. Reference `../admin-app` for Base UI patterns.

**7 files to update:**

| File                                          | Headless UI → Base UI                                                                    |
| --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `src/components/Confirm.tsx`                  | Dialog/DialogPanel/DialogTitle/Description → Base UI Dialog                              |
| `src/components/ConfirmWithContent.tsx`       | Dialog/DialogPanel/DialogTitle/Description → Base UI Dialog                              |
| `src/components/Filters/FiltersPanel.tsx`     | Combobox (6 parts) + Switch + Transition → Base UI Combobox + Checkbox + CSS transitions |
| `src/components/RideDetails/RideMessages.tsx` | Dialog/DialogPanel/DialogTitle → Base UI Dialog                                          |
| `src/components/RideDetails/RiderDetails.tsx` | Switch → Base UI Checkbox/Switch                                                         |
| `src/components/forms/RideForm.tsx`           | Switch → Base UI Checkbox/Switch                                                         |
| `src/components/forms/ChangeAvatarModal.tsx`  | Dialog/DialogPanel/DialogTitle/Description → Base UI Dialog                              |

---

## Phase 6: Styling migration

- Remove `postcss.config.cjs` (already in Phase 1)
- Tailwind v4 via `@tailwindcss/vite` plugin (already configured in `vite.config.ts`)
- CSS import in `__root.tsx` via `import appCss from "../styles/globals.css?url"` and add to `head()` links
- DaisyUI, tailwindcss-motion, @tailwindcss/forms, @tailwindcss/typography — keep as-is (they work with Tailwind v4 Vite plugin)

---

## Phase 7: Testing migration (Jest → Vitest)

- Delete `jest.config.cjs`
- Add `vitest.config.ts` or configure in `vite.config.ts`:
  ```ts
  test: {
    environment: "jsdom",
    globals: true,
  }
  ```
- Update test imports: `@testing-library/jest-dom` → `@testing-library/jest-dom/vitest`
- Replace `jest.fn()` → `vi.fn()`, etc. in test files
- Update `package.json` test script to `vitest run`

---

## Phase 8: Cleanup + Vercel config

- Delete `src/app/` directory entirely
- Delete `next-env.d.ts`, `.next/` build dir
- Remove `yarn.lock`, `.yarn/`, `.yarnrc.yml`
- Remove `bin/serve`, `bin/stop` (Next.js custom serve scripts)
- Remove `UnregisterServiceWorkers` component (no longer needed)
- Update `.gitignore`: remove `.next`, add `.output`, `.vinxi`
- Update Vercel project settings: framework = "Other" or auto-detect TanStack Start
- Update Vercel env vars: rename `NEXT_PUBLIC_*` → `VITE_*` (after code changes merged, before production deploy)

---

## Verification

1. `bun install` — deps install cleanly
2. `bun run dev` — app starts, navigate all routes
3. Verify Auth0 login/logout flow works
4. Verify React Query data fetching works (rides list, ride details, calendar, users)
5. Verify forms work (create/edit/copy ride, edit profile)
6. `bun run build` — builds without errors
7. `bun run check-types` — no type errors
8. `bun run test` — tests pass
9. Deploy to Vercel preview — app works end-to-end
10. Check static asset serving (fonts, icons, manifest)
11. Verify Base UI modals open/close correctly (Confirm, ConfirmWithContent, ChangeAvatar, RideMessages)
12. Verify Base UI Combobox filtering works in FiltersPanel
13. Verify Base UI Switch toggles work in RideForm, FiltersPanel, RiderDetails
14. Verify no duplicate toasts render

---

## Resolved decisions

- `@headlessui/react` → switch to `@base-ui/react` (aligns with admin-app)
- PWA manifest — keep (enables phone home screen icons)
- Vercel env vars — rename after code changes merged, before production deploy
