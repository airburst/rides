# ISR Optimization Plan

## Current State

- All pages are **fully dynamic** (no caching)
- Every page view = 1 serverless function invocation
- Optimistic updates via Jotai atoms already bridge UI gaps
- `RideCard` subscribes to `optimisticRideUpdatesAtom` and applies updates on top of server data

## Why ISR Works With Your Optimistic Updates

```
User joins ride → Jotai atom updated → UI shows "GOING" + count+1
User navigates to list → Cached page served (stale data)
                       → RideCard applies optimistic update from Jotai
                       → User sees correct state
Cache expires → Fresh data includes the join
```

The optimistic updates auto-cleanup after 30s (see `cleanupOptimisticUpdatesAtom`).

---

## Implementation Plan

### Phase 1: Add ISR to High-Traffic Pages

| Page | File | Revalidate | Notes |
|------|------|------------|-------|
| Home | `src/app/page.tsx` | 30s | Highest traffic |
| Calendar | `src/app/calendar/page.tsx` | 60s | |
| Calendar date | `src/app/calendar/[...date]/page.tsx` | 60s | |
| Ride details | `src/app/ride/[...id]/page.tsx` | 15s | Needs fresher data |
| Rides by date | `src/app/rides/[...date]/page.tsx` | 30s | |

**Code change** - add to each page:
```typescript
export const revalidate = 30; // seconds
```

### Phase 2: Convert Read-Only Server Actions to Cached Fetches

Current: `getRides()` is a server action (always invokes function)
Better: Use `unstable_cache` for read operations

```typescript
import { unstable_cache } from "next/cache";

export const getCachedRides = unstable_cache(
  async (start: string, end: string) => {
    // existing db query
  },
  ["rides"],
  { revalidate: 30, tags: ["rides"] }
);
```

Then use `revalidateTag("rides")` after mutations instead of `revalidatePath()`.

### Phase 3: Optimize Session Calls

Current: `getServerAuthSession()` called on every page render
Problem: Session lookup = DB query = slower + more load

Options:
1. **JWT strategy** (recommended) - session stored in cookie, no DB lookup
2. **Edge middleware** - validate session once at edge, pass user to pages

---

## Estimated Impact

| Change | Invocation Reduction |
|--------|---------------------|
| ISR on homepage (30s) | ~97% for that page |
| ISR on calendar | ~95% |
| Cached read actions | ~80% for data fetches |
| **Total estimate** | **60-80% reduction** |

With ~100K invocations/month, this could bring you to ~20-40K.

---

## Files to Modify

1. `src/app/page.tsx` - add `export const revalidate = 30`
2. `src/app/calendar/page.tsx` - add `export const revalidate = 60`
3. `src/app/calendar/[...date]/page.tsx` - add `export const revalidate = 60`
4. `src/app/ride/[...id]/page.tsx` - add `export const revalidate = 15`
5. `src/app/rides/[...date]/page.tsx` - add `export const revalidate = 30`
6. `src/server/actions/get-rides.ts` - wrap with `unstable_cache`
7. `src/server/actions/get-ride.ts` - wrap with `unstable_cache`
8. Mutation actions - change `revalidatePath()` to `revalidateTag()`

---

## Unresolved Questions

- Acceptable staleness for ride details page? (proposed 15s)
- Should repeating-rides pages also be cached?
- Want to pursue JWT sessions (Phase 3)?
