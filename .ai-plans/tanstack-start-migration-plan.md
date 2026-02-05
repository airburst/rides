# TanStack Start Migration Plan (Updated 2026-02-05)

## Context & Approach

**Current State:**
- Phase 3 of External API migration complete (core features using TanStack Query + Auth0 SPA + external Hono API)
- Remaining server features: Calendar, Profile, Repeating Rides, Ride Forms (still use server actions)
- All user-facing features already client-side with optimistic updates

**Migration Strategy:**
1. **First**: Complete Next.js → External API migration (Features 4-7)
2. **Then**: Migrate from Next.js to TanStack Start
3. **Auth**: Keep Auth0 SPA (no user disruption)
4. **Testing**: Basic smoke tests (2-3 days vs full Playwright suite)

**Benefits of TanStack Start:**
- True client-side routing (faster navigation)
- Smaller bundle size (no Next.js overhead)
- Better DX with TanStack Router
- Same stack as external API (Vinxi)
- Removes Vercel serverless functions entirely

---

## Pre-Migration: Complete External API Features 4-7

### Feature 4: Calendar
**API Endpoints:**
- `GET /calendar/:month` - get rides for calendar month
- Response: `{ rides: RideList[], month: string }`

**Frontend:**
- Convert `src/components/Calendar/index.tsx` to client component
- Create `useCalendar(month)` hook
- Update pages to use TanStack Query

**Effort:** 2-3 hours

### Feature 5: Profile
**API Endpoints:**
- `GET /users/:id` - get user profile
- `PATCH /users/:id` - update user profile (preferences, units)

**Frontend:**
- Convert `src/components/forms/UserProfileForm.tsx` to use TanStack Query
- Create `useUser(id)` and `useUpdateUser()` hooks
- Remove `getUser()` server action

**Effort:** 1-2 hours

### Feature 6: Repeating Rides (Admin)
**API Endpoints:**
- `GET /repeating-rides` - list all
- `GET /repeating-rides/:id` - get single
- `POST /repeating-rides` - create
- `PUT /repeating-rides/:id` - update
- `DELETE /repeating-rides/:id` - delete

**Frontend:**
- Create hooks: `useRepeatingRides()`, `useRepeatingRide()`, `useCreateRepeatingRide()`, etc.
- Convert all repeating rides components to client-side
- Remove server actions

**Effort:** 3-4 hours

### Feature 7: Ride Forms (LEADER+)
**API Endpoints:**
- `POST /rides` - create ride
- `PUT /rides/:id` - update ride
- `DELETE /rides/:id` - delete ride
- `POST /rides/:id/cancel` - cancel ride

**Frontend:**
- Convert ride forms to use TanStack Query mutations
- Create hooks: `useCreateRide()`, `useUpdateRide()`, `useDeleteRide()`, `useCancelRide()`
- Remove server actions

**Effort:** 3-4 hours

**Total Pre-Migration Time:** ~10-13 hours

---

## Phase 1: Foundation Setup (2-3 days)

### 1.1 Install TanStack Start
```bash
npm install @tanstack/start @tanstack/react-router vinxi
npm install -D @tanstack/router-devtools @tanstack/router-vite-plugin
```

### 1.2 Project Structure
Create parallel structure (Next.js stays on :3000, TanStack Start on :3001):
```
app/                    # New TanStack Start app
├── routes/
│   ├── __root.tsx     # Root layout
│   └── index.tsx      # Home page
├── router.tsx         # Router config
└── ssr.tsx           # SSR entry

src/                   # Shared code
├── components/        # Same components
├── hooks/             # Same TanStack Query hooks
├── lib/               # Same API client
└── contexts/          # Same contexts

app.config.ts         # Vinxi config
```

### 1.3 Environment Variables
- Already using `@t3-oss/env-core` compatible approach
- No changes needed (env.js works with any framework)

### 1.4 Basic App Config
```typescript
// app.config.ts
import { defineConfig } from '@tanstack/start/config'

export default defineConfig({
  server: {
    preset: 'vercel',
    port: 3001,
  },
  vite: {
    // Reuse existing Tailwind/PostCSS config
  }
})
```

**Checklist:**
- [ ] Install dependencies
- [ ] Create `app/` directory structure
- [ ] Configure `app.config.ts`
- [ ] Setup root route with layout
- [ ] Verify dev server runs on :3001

---

## Phase 2: Core Routes & Components (3-4 days)

### 2.1 Route Structure
Map Next.js app router to TanStack Router:

```
Next.js                        TanStack Router
src/app/page.tsx          →    app/routes/index.tsx
src/app/rides/[date]/     →    app/routes/rides/$date.tsx
src/app/ride/[id]/        →    app/routes/ride/$id.tsx
src/app/ride/new/         →    app/routes/ride/new.tsx
src/app/calendar/         →    app/routes/calendar.tsx
src/app/calendar/[date]/  →    app/routes/calendar/$date.tsx
src/app/profile/          →    app/routes/profile.tsx
src/app/repeating-rides/  →    app/routes/repeating-rides.tsx
```

### 2.2 Component Migration
**No changes needed** - components already client-side:
- All components use `"use client"`
- Already use TanStack Query hooks
- Already use Auth0 hooks
- Just need to swap `next/link` → TanStack Router `<Link>`

### 2.3 Replace Next.js APIs
```typescript
// Before (Next.js)
import Link from 'next/link'
import { useRouter, usePathname, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

// After (TanStack Router)
import { Link, useNavigate, useLocation, useParams } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
```

### 2.4 Layout & Styling
- Copy global CSS, Tailwind config, DaisyUI setup
- Port `src/app/layout.tsx` to `app/routes/__root.tsx`
- Same Providers component (Auth0 + QueryClient + FilterContext)

**Checklist:**
- [ ] Create all route files
- [ ] Port Header to root layout
- [ ] Update all `<Link>` components
- [ ] Replace `useRouter`/`usePathname` calls
- [ ] Remove `next/dynamic` imports
- [ ] Test navigation between routes

---

## Phase 3: Authentication & Authorization (1 day)

### 3.1 Auth0 Integration
**No changes needed** - already using Auth0 SPA SDK:
- `useAuth0()` hook works in any React app
- `getAccessTokenSilently()` already implemented
- Same API client with JWT tokens

### 3.2 Protected Routes
Use TanStack Router's `beforeLoad`:

```typescript
// app/routes/ride/new.tsx
export const Route = createFileRoute('/ride/new')({
  beforeLoad: async ({ context }) => {
    const { isAuthenticated, user } = context.auth
    const isLeader = ['ADMIN', 'LEADER'].includes(user?.role ?? '')
    
    if (!isAuthenticated || !isLeader) {
      throw redirect({ to: '/' })
    }
  },
})
```

**Checklist:**
- [ ] Add auth context to router
- [ ] Protect LEADER+ routes (create/edit/delete rides)
- [ ] Protect ADMIN routes (users, repeating rides)
- [ ] Test unauthorized access redirects

---

## Phase 4: API Routes & Cron Jobs (1 day)

### 4.1 Convert API Routes
Next.js has 3 API routes (move to external Hono API instead):
- `/api/generate` → Hono endpoint
- `/api/riderhq` → Hono endpoint  
- `/api/archive-rides` → Hono endpoint (cron)

**OR** keep as Nitro API routes in TanStack Start if needed.

### 4.2 Cron Jobs
Option 1: Move to external API (preferred)
Option 2: Use Vercel cron with TanStack Start API routes

**Checklist:**
- [ ] Migrate or recreate API routes
- [ ] Test cron job integration
- [ ] Verify CRON_SECRET auth

---

## Phase 5: Testing (2-3 days)

### 5.1 Smoke Tests
Basic Playwright tests for critical paths:

```typescript
test('anonymous user can view rides', async ({ page }) => {
  await page.goto('http://localhost:3001')
  await expect(page.getByText('No planned rides')).toBeVisible()
})

test('user can login and join ride', async ({ page }) => {
  // Auth0 login flow
  // Find ride, click join
  // Verify optimistic update
})

test('leader can create ride', async ({ page }) => {
  // Login as leader
  // Navigate to /ride/new
  // Fill form, submit
  // Verify ride created
})
```

### 5.2 Test Coverage
- Home page (anonymous + authenticated)
- Login/logout flow
- View ride details
- Join/leave ride (optimistic updates)
- Create ride (LEADER only)
- Calendar navigation

**Checklist:**
- [ ] Install Playwright
- [ ] Setup test database
- [ ] Write 5-7 smoke tests
- [ ] Verify all pass
- [ ] Document test commands

---

## Phase 6: Deployment & Cutover (1 day)

### 6.1 Vercel Configuration
```typescript
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "framework": "vite",
  "installCommand": "npm install"
}
```

### 6.2 Environment Variables
Copy all `NEXT_PUBLIC_*` vars to Vercel project (same values):
- NEXT_PUBLIC_AUTH0_DOMAIN
- NEXT_PUBLIC_AUTH0_CLIENT_ID
- NEXT_PUBLIC_AUTH0_AUDIENCE
- NEXT_PUBLIC_API_URL
- etc.

### 6.3 Cleanup
Remove Next.js dependencies:
```bash
npm uninstall next next-auth @auth/drizzle-adapter @nextjs/auth0
```

Delete Next.js files:
```bash
rm -rf src/app/
rm next.config.js
```

Update package.json scripts:
```json
{
  "scripts": {
    "dev": "vinxi dev",
    "build": "vinxi build",
    "start": "vinxi start"
  }
}
```

### 6.4 Database Cleanup
- Remove NextAuth tables: `accounts`, `sessions`, `verificationTokens`
- Keep user data (already using Auth0 for auth)

**Checklist:**
- [ ] Deploy to Vercel preview
- [ ] Test all routes in production
- [ ] Verify Auth0 login works
- [ ] Check API calls succeed
- [ ] Deploy to production
- [ ] Remove Next.js code
- [ ] Clean up database

---

## Timeline Summary

| Phase | Effort | Dependencies |
|-------|--------|--------------|
| Pre-Migration (Features 4-7) | 10-13 hours | External API updates |
| Phase 1: Foundation | 2-3 days | - |
| Phase 2: Routes & Components | 3-4 days | Phase 1 |
| Phase 3: Auth | 1 day | Phase 2 |
| Phase 4: API Routes | 1 day | Phase 2 |
| Phase 5: Testing | 2-3 days | Phase 2-4 |
| Phase 6: Deployment | 1 day | Phase 5 |
| **Total** | **~2-3 weeks** | - |

---

## Success Criteria

- [ ] All routes accessible and functional
- [ ] Auth0 login/logout working
- [ ] TanStack Query data fetching working
- [ ] Optimistic updates working
- [ ] Role-based access control working
- [ ] Forms submitting correctly
- [ ] Calendar navigation working
- [ ] Smoke tests passing
- [ ] Deployed to Vercel
- [ ] No Next.js dependencies remaining

---

## Rollback Plan

Keep Next.js app tagged before migration:
```bash
git tag pre-tanstack-start
git push origin pre-tanstack-start
```

If issues occur, can quickly redeploy Next.js version while fixing TanStack Start issues.

---

## Notes

- TanStack Start is in RC, but stable enough for production
- Same component code (no rewrites)
- Simpler mental model (no server/client boundary)
- Faster development (file-based routing, better HMR)
- Keeps external API architecture (reduces Vercel costs)
