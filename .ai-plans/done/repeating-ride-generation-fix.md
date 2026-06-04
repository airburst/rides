# Repeating-ride generation fix

Three linked problems found while debugging "Thirsty Thursdays created, no modal, no rides".

## Root causes (confirmed)

1. **Empty preview window → no modal, no rides** (client `src/utils/repeatingRides.ts` + `src/components/forms/RideForm/index.tsx`).
   `makeRidesInPeriod` window = `[startDate, 1st-of-next-month)` = remainder of the *current* month. If the recurrence's next occurrence is after the month boundary (e.g. weekly Thursday created Jun 26), the list is empty. `RideForm` only opens the modal when `rideDates.length > 0`, so the whole flow silently no-ops. Reproduced: Jun 26 / Jun 30 starts → 0 rides.

2. **Silent failure UX** (`RideForm/index.tsx:162`). `void repeatingRideToDb(...).then(...)` has no `.catch`, and the empty list gives no feedback. Either path leaves the admin with a created template and zero signal.

3. **Generation not idempotent** (server `rides-api/src/routes/generate.ts`). `createRidesFromSet` inserts every computed ride with a fresh UUID and **no existence check**. The only guard is mutating the template `schedule` DTSTART forward after insert — fragile (observed duplicates) and it corrupts the template's real start date. No DB unique constraint on `(scheduleId, rideDate)` (only a non-unique index).

## Intended behaviour (confirmed with user)
- On create: offer to generate from start date **through end of next month**.
- Empty/again: surface feedback; add `.catch`.
- **After rides are generated they must never be duplicated by another `/generate` call.**

## Plan

### A. Client (rides) — window + UX
- A1. Widen `makeRidesInPeriod` window end to start-of-(month after next) so a freshly created template always previews its upcoming rides. Backed by idempotency, overlap is harmless.
- A2. In `RideForm`: add `.catch` to the generate-preview chain (toast on error); when the computed list is empty, still inform the user (toast: "No upcoming rides to add — the monthly job will create them") instead of doing nothing.
- A3. Tests in `repeatingRides.test.ts` for late-month start dates (currently 0 → now non-empty).

### B. Server (rides-api) — window + idempotency
- B1. Mirror the window widen in `lib/rrule-utils.ts` so the modal preview matches what `/generate` actually creates.
- B2. **Idempotent insert** in `createRidesFromSet`: within a transaction, query existing rides for the template's `scheduleId` at the candidate `rideDate`s (regardless of `deleted`, so a deliberately-deleted ride is NOT resurrected), filter them out, insert only the new ones. Report accurate `count`.
- B3. Remove the DTSTART-advancement hack (dedup replaces it; stops corrupting template start date).
- B4. Tests: generate twice → second call inserts 0; deleted ride not recreated; partial overlap inserts only the gap.

### C. Hard DB guarantee (decision-gated)
- C1. Partial unique index `unique (scheduleId, rideDate) where scheduleId is not null` as a drizzle migration → true concurrency safety + `onConflictDoNothing`.
  - **Blocker:** existing prod duplicates must be removed first, and `users_on_rides` FK means naive deletion can drop rides that have signups. Needs a careful cleanup (keep the row with signups / earliest), run deliberately.

## Decisions needed
1. Idempotency level: app-level filter now (B2) vs also add the DB unique index now (C, needs risky prod dup cleanup first).
2. Existing duplicate rides already in the DB: write a careful, reviewed cleanup script (you run it), or leave them and only prevent new dups?

## Unresolved questions
- Horizon: widening to end-of-next-month means cron generates ~2 months ahead (self-healing via idempotency). OK, or keep cron at exactly next month (parameterize window per call site)?
- Cleanup tie-break when dups differ (one edited, one has signups): keep which?
