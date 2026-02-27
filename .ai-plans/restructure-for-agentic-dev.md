# Restructure for agentic development

## Context

Today's DST fix demonstrated the core problem: a date format change in the API required tracing 24+ files, fixing inline date parsing in route files, and we still missed the copy route (it has the same `+00` bug right now). The codebase has patterns that cause AI agents to miss scattered instances of the same logic.

This plan targets the **highest-impact friction points** — things that cause bugs and wasted time during agentic changes.

---

## 1. Centralize postgres date normalization

**Problem**: Routes manually parse `ride.rideDate` with inline string ops. Edit has the `+00→Z` fix, copy doesn't.

**Fix**: Add a `normalizeApiDate` function to `src/utils/dates.ts` that handles postgres timestamptz format:

```typescript
/** Normalize postgres timestamptz string to ISO 8601 */
export const normalizeApiDate = (date: string): string =>
  date.replace(" ", "T").replace(/\+00$/, "Z");
```

**Files**: `src/utils/dates.ts`

---

## 2. Replace inline date parsing in routes with `getFormRideDateAndTime`

**Problem**: `src/utils/dates.ts` already exports `getFormRideDateAndTime` which returns `{ rideDate, startDate, time }` — exactly what the route files compute inline (badly). These 7-line inline blocks should be one function call.

**Fix**: Update `getFormRideDateAndTime` to normalize internally, then use it in:
- `src/routes/ride/edit/$id.tsx` (lines 48-53) — also fixes existing `+00` workaround
- `src/routes/ride/copy/$id.tsx` (lines 48-53) — also fixes the latent `+00` bug

**Before** (edit/$id.tsx):
```typescript
const rideDateStr = ride.rideDate?.replace(" ", "T").replace(/\+00$/, "Z") ?? "";
const rideDateTime = rideDateStr ? new Date(rideDateStr) : null;
const time = rideDateTime
  ? `${String(rideDateTime.getUTCHours()).padStart(2, "0")}:${String(rideDateTime.getUTCMinutes()).padStart(2, "0")}`
  : "";
const rideDate = rideDateStr.split("T")[0] ?? "";
```

**After**:
```typescript
const { rideDate, time } = getFormRideDateAndTime(ride.rideDate);
```

---

## 3. Clean up dates.ts offset hacks

**Problem**: Now that the API returns proper UTC timestamps (with `+00`/`Z`), the repeated `utcOffset() → add(delta, "minutes")` pattern in ~10 functions is unnecessary for API dates. These were workarounds for the old naive timestamp format.

**Fix**: Remove offset compensation from formatting functions that receive API dates. The pattern `dayjs(date).utc().format(...)` is sufficient when the input is already UTC.

**Functions to simplify** (all in `src/utils/dates.ts`):
- `formatDate` (line 111-115)
- `formatDateShort` (line 117-121)
- `formatCalendarDate` (line 123-127)
- `formatFormDate` (line 133-136)

Each changes from:
```typescript
const delta = dayjs(date).utcOffset();
return dayjs(date).utc().add(delta, "minutes").format("...");
```
To:
```typescript
return dayjs(date).utc().format("...");
```

**Also simplify**: `getDateFromString`, `getQueryDateRange`, `getNow` — same pattern.

**Note**: `getNextNWeeks` and `getQueryDateRange` use offset for "today" calculations (no API date) — review these carefully; they may still need local time logic.

**Tests**: Update `src/utils/dates.test.ts` — existing tests should still pass since inputs are UTC ISO strings.

---

## 4. DRY up edit/copy route boilerplate

**Problem**: `ride/edit/$id.tsx` and `ride/copy/$id.tsx` are 85% identical (auth check, loading/error states, default values construction). Only differences: edit passes `id`, copy omits it.

**Fix**: Extract a `useRideFormDefaults(id)` hook to `src/hooks/rides/useRideFormDefaults.ts` that returns `{ defaultValues, isLoading, error, isLeaderOrAdmin }`. Both routes become thin wrappers.

**Files**:
- New: `src/hooks/rides/useRideFormDefaults.ts`
- Simplify: `src/routes/ride/edit/$id.tsx`
- Simplify: `src/routes/ride/copy/$id.tsx`
- Update: `src/hooks/rides/index.ts` (barrel export)

---

## 5. Extract `useRepeatingRideFormDefaults` hook

Same pattern as step 4 but for repeating rides. Extract shared logic from `repeating-rides/copy/$id.tsx` and `repeating-rides/edit/$id.tsx` into `src/hooks/repeating-rides/useRepeatingRideFormDefaults.ts`.

**Files**:
- New: `src/hooks/repeating-rides/useRepeatingRideFormDefaults.ts`
- Simplify: `src/routes/repeating-rides/edit/$id.tsx`
- Simplify: `src/routes/repeating-rides/copy/$id.tsx`
- Update: `src/hooks/repeating-rides/index.ts` (barrel export)

---

## 6. Split calendar helpers out of dates.ts

**Problem**: `dates.ts` mixes ride date utilities with calendar-specific helpers, making it harder to reason about.

**Fix**: Move calendar helpers into `src/routes/calendar/calendarDates.ts` as a sidecar file:
- `getMonth`, `getLastMonth`, `getNextMonth`
- `firstDayOfMonth`, `daysInMonth`
- `getMonthDateRange`, `getDateStub`
- `formatCalendarDate`

Keep the private `utcDate` helper in the new file (only used by `getLastMonth`/`getNextMonth`).

**Files**:
- New: `src/routes/calendar/calendarDates.ts`
- Slim down: `src/utils/dates.ts`
- Update imports in: `src/routes/calendar/$date.tsx`, `src/routes/calendar/index.tsx`, any component importing calendar helpers

---

## 7. Red-green tests for each step

Use TDD approach: write tests first to lock in current behaviour, then refactor.

- **Step 1-3**: Add tests to `src/utils/dates.test.ts` for `normalizeApiDate`, `formatTime`, `formatFormDate`, `getFormRideDateAndTime` with both old ISO and new postgres format inputs. Run tests → green. Then refactor → still green.
- **Step 4-5**: Add tests for `useRideFormDefaults` and `useRepeatingRideFormDefaults` hooks (mock API response, verify returned default values).
- **Step 6**: Add `src/routes/calendar/calendarDates.test.ts` for extracted calendar helpers.

---

## Verification

1. `bun run lint && bun run check-types && bun test` — all pass at each step
2. Manually test: edit a ride → time input populated
3. Manually test: copy a ride → time input populated
4. Manually test: ride cards show correct times
5. Manually test: calendar view renders correctly
