# Ride Details Redesign

## Summary

Restructure the ride details page for better visual hierarchy and scannability. The main card gets a hero treatment, metadata becomes icon-based, route link becomes a CTA, and action buttons become fixed.

## Changes

### 1. RideInfo card — hero layout

**Before:** Two-column grid (label | value) for all fields equally.

**After:**

- **Time** — small muted text above ride name
- **Ride name** — large bold, dominates the card
- **Group badge** — colored pill/badge inline with or below the name
- **Cancelled banner** — stays as-is (full-width red bar)

### 2. RideInfo card — icon-based metadata

Replace the label-value grid rows for meet/destination/distance/leader with compact icon+text items:

- `MapPin` icon + `{meetPoint} → {destination}` (or just meetPoint if no destination)
- `Ruler` icon + `{distance}`
- `UserRound` icon + `{leader}`

Laid out as a flex-wrap row with gaps, not a rigid grid.

### 3. Route link → CTA button

Replace `<a>Click to see route</a>` with a full-width outlined button:

- `Map` icon + "View Route"
- Opens in new tab (same behavior)
- Styled as secondary/outlined button

### 4. Notes section

No changes — already has show more/less collapsible behavior via Markdown Viewer.

### 5. Action buttons — fixed bottom

Move the BACK / NOTE / LEAVE button bar to `fixed bottom-0`:

- Full-width bar pinned to viewport bottom
- Background matches theme (white + top border or shadow)
- Remove `mb-16` since no bottom nav exists
- Add `pb-[env(safe-area-inset-bottom)]` for iOS safe area

### 6. Skeleton update

Update `RideDetailsSkeleton` to match the new layout structure.

## Files to modify

1. `src/components/RideDetails/RideInfo.tsx` — hero layout + icon metadata + route CTA
2. `src/components/RideDetails/Row.tsx` — may be removable or reduced in usage
3. `src/components/RideDetails/RideDetailsClient.tsx` — fixed bottom action bar
4. `src/components/RideDetails/RideDetailsSkeleton.tsx` — match new layout

## Out of scope

- Rider list / Going section styling
- Notes content or collapsible behavior
- Messages section
