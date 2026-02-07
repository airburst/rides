# External API Migration Plan

## 🎯 Current Status (2026-02-07)

**✅ Phase 0:** Auth0 SPA Setup - COMPLETE  
**✅ Phase 1:** API Foundation - COMPLETE  
**✅ Phase 2:** Read Endpoints - COMPLETE  
**✅ Phase 3:** Frontend Migration - COMPLETE  
**✅ Phase 4:** Write Endpoints - COMPLETE  
**✅ Phase 5:** Cleanup - COMPLETE  
**🚨 Phase 6:** Static Export - **IN PROGRESS (HIGH PRIORITY)**

### What's Working Now
- ✅ All pages converted to client components (Auth0 SPA)
- ✅ All CRUD operations use external API
- ✅ Rides list, details, join/leave with optimistic updates
- ✅ Ride create/edit/delete/cancel forms
- ✅ Calendar view (client-side)
- ✅ User profile editing
- ✅ Repeating rides management (full CRUD + generate)
- ✅ Auth0 SPA authentication
- ✅ Jotai fully removed - replaced with TanStack Query + React Context
- ✅ Cron job endpoints migrated to rides-api
- ✅ GitHub cron workflows updated to use api.fairhursts.net
- ✅ Old Next.js API routes removed (riderhq, generate, archive-rides)

### What's Next (Phase 6 - See Below)
- ✅ ~~Remove short URL feature~~ - COMPLETE
- ✅ ~~Remove NextAuth API route~~ - COMPLETE
- ⏳ Enable static export in next.config.js (PAUSED - deploy current state first)
- ⏳ Deploy to static hosting (Cloudflare Pages/Netlify)

### What's Still Pending (Future)
- ⏳ Avatar upload (needs alternative to Next.js image processing)
- ⏳ Remove NextAuth completely (after static export works)
- ⏳ Merge feature/external-api branch to main
- ⏳ Full cleanup: remove database schema, drizzle, all server infrastructure

---

## 🚨 Phase 6: Static Export (NEXT - HIGH PRIORITY)

### Goal

Convert Next.js app to full static export (`output: 'export'`) to enable deployment to any static hosting provider (Cloudflare Pages, Netlify, S3). This eliminates all server-side rendering and serverless functions.

### 🔴 Critical Blockers (DO FIRST)

**Short URL Feature Removal** - Only server-rendered page blocking static export:

- [x] Remove "Copy Ride Link" menu item from `src/components/UserMenu/MenuContent.tsx` ✅
- [x] Remove `copyLink()` function from `src/components/UserMenu/MenuContent.tsx` ✅
- [x] Delete `/src/app/r/[...id]/page.tsx` - short URL redirect page ✅
- [x] Delete `/src/server/actions/get-ride-by-shortid.ts` - server action for lookups ✅

**NextAuth API Route Removal** - Unused, blocks static export:

- [x] Delete `/src/app/api/auth/[...nextauth]/route.ts` ✅

**Status**: ✅ All critical blockers removed! Ready for static export configuration.

### Configure Static Export

- [ ] Update `next.config.js`:
  - [ ] Add `output: 'export'`
  - [ ] Remove `experimental.serverActions` config (not needed)
  - [ ] Handle Image optimization (add `unoptimized: true` or use external service)
- [ ] Verify root layout is not async (incompatible with static export)
- [ ] Test build creates `out/` directory with static files

### Validation & Testing

- [ ] Build succeeds with static export
- [ ] All pages render correctly
- [ ] Auth0 SPA authentication works
- [ ] All CRUD operations work via external API
- [ ] Test critical flows:
  - [ ] View/join/leave rides
  - [ ] Create/edit/delete rides
  - [ ] Calendar view
  - [ ] Profile editing
  - [ ] Repeating rides management

### Documentation

- [ ] Update README with static deployment instructions
- [ ] Document deployment options (Cloudflare Pages, Netlify, S3)
- [ ] Note what cleanup can be done next (database, drizzle, server code)

### Expected Benefits

- 📦 Smaller deployment (no server functions)
- ⚡ Faster builds (no SSR)
- 💰 Cheaper hosting (any static host)
- 🚀 Better CDN performance

---

## Phase 5: Cleanup ✅

**Completed Tasks:**
- [x] Remove Jotai ✅
- [x] Remove old RidesList server component
- [x] All pages converted to client components
- [x] Cron endpoints migrated to rides-api
- [x] Add env vars to Oracle Cloud VM (API_KEY, RIDERHQ_*)
- [x] Update GitHub cron jobs to use `https://api.fairhursts.net`
- [x] Delete old Next.js API routes (riderhq, generate, archive-rides)
- [x] Update .env.example files

**Deferred:**
- [ ] Remove NextAuth (will do after Phase 6 static export)
- [ ] Avatar upload alternative (deferred)
- [ ] Merge feature/external-api to main (after Phase 6)
- [ ] Final testing
- [ ] Monitor Vercel usage

---
