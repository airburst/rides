# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 4.6.4 - 2026-03-23

### Fixed

- Self-host Outfit font via fontsource to eliminate render-blocking Google Fonts requests
- Prefix calendar helper files with `-` to exclude from TanStack Router route tree

## 4.6.3 - 2026-03-01

### Fixed

- Calendar title now displays the correct month when navigating across DST boundaries

## 4.6.2 - 2026-02-27

### Changed

- Added centralized API timestamp normalization via `normalizeApiDate()` in `src/utils/dates.ts`
- Replaced inline ride date parsing in ride edit/copy routes with shared form default generation
- Extracted shared form-default hooks for ride and repeating-ride edit/copy flows
- Split calendar-specific date helpers from `src/utils/dates.ts` into `src/routes/calendar/calendarDates.ts`

### Technical

- Added targeted tests for date normalization/form date parsing and new form-default hooks
- Added calendar helper tests for extracted `calendarDates` module

## 4.6.1 - 2026-02-27

### Fixed

- Ride times no longer shift by 1 hour after DST transition
- Edit form time input now populates correctly
- Simplified `getRideDateAndTime` to remove redundant UTC offset conversion

## 4.6.0 - 2026-02-23

### Changed

- Replaced radix-ui with @base-ui/react for all UI primitives (Sheet, Label)
- FiltersPanel now uses Sheet with top slide animation, gaining backdrop, focus trap and escape key dismissal
- Sheet backdrop uses CSS transitions instead of animations for reliable open/close
- Removed unused dark mode styles from button variants

### Added

- Local Slot component replacing radix-ui Slot dependency

### Technical

- Removed radix-ui dependency entirely
- Removed unused animate-slide-down keyframe and useOnClickOutside hook usage from FiltersPanel

## 4.5.0 - 2026-02-22

### Changed

- Replaced DaisyUI with ShadCN component library (Button, Input, Label, Sheet, Badge, Alert)
- Migrated all forms to ShadCN Input + styled native select
- Replaced DaisyUI drawer with ShadCN Sheet for user menu and filter panel
- Replaced DaisyUI chat/badge/alert/avatar with custom Tailwind implementations
- Upgraded zod to v4 and zod-form-data to v3
- Consolidated clsx usage to cn() utility (clsx + tailwind-merge)
- Collapsed CSS bridge layer to direct hex values in @theme inline

### Added

- Form test coverage: schema validation tests + component integration tests (43 tests)
- ShadCN UI components: button, input, label, sheet, badge, alert, native-select
- Spinner component replacing DaisyUI loading-spinner pattern

### Technical

- Removed DaisyUI dependency entirely — CSS bundle reduced from 104KB to 48KB
- Theme files (bath.ts, shrewsbury.ts) converted to ShadCN variable format

## 4.4.4 - 2026-02-22

### Technical

- Upgraded TypeScript from 5.9.3 to 6.0.0-beta
  - Performance improvements in type checking
  - Enhanced type inference and control flow analysis
  - All tests and builds passing

## 4.4.3 - 2026-02-22

### Updated

- Updated dependencies

## 4.4.2 - 2026-02-22

### Fixed

- Fixed RideCard time display not showing ride start time
  - Compute time from `rideDate` using `formatTime()` utility
  - Previously relied on optional `time` field not populated by API

## 4.4.1 - 2026-02-20

### Fixed

- Removed 5 unnecessary `useMemo` calls wrapping trivially cheap expressions
  - Simple comparisons (`freq === 0`)
  - Boolean operations (`isPending` OR chain, `showRepeatingSwitch` boolean)
  - These had overhead exceeding the computation cost
- Fixed default array props creating new references every render
  - Extracted `EMPTY_RIDES` constant in Calendar/Day component
  - Extracted `EMPTY_NOTES` constant in RideDetails/Messages component

### Changed

- Added DOMPurify sanitization to all `dangerouslySetInnerHTML` usages
  - Markdown Viewer: sanitize markdown-it output
  - Markdown Editor: sanitize preview HTML
  - ChatMessage: sanitize makeClickableUrl output
  - Prevents XSS vulnerabilities while preserving safe HTML formatting

### Technical

- Added `isomorphic-dompurify` dependency for HTML sanitization
- React Doctor score improved: 92/100 → 93/100 (5 fewer warnings)

## 4.4.0 - 2026-02-14

### Added

- Avatar cropping UI - Users can now crop and adjust their profile pictures before upload
  - Visual crop editor with zoom/pan controls (1x-3x zoom)
  - Square aspect ratio enforced for consistent avatars
  - Grid overlay for composition guidance
  - Client-side image processing using Canvas API
  - Lazy-loaded cropping library (24KB) - doesn't slow down profile page load
  - Touch-friendly controls for mobile devices
  - Preview and adjust framing before finalizing upload

### Changed

- Avatar upload flow now requires crop confirmation before upload
- Modal dialog expanded to accommodate crop editor (max-w-2xl)
- Simplified file selection UI (removed redundant avatar preview)
- Pre-cropped 240px image sent to backend (backend still generates 40px thumbnail)

### Technical

- Added `react-easy-crop` dependency (code-split)
- Created `cropImage.ts` utility for canvas-based WebP generation
- Created `ImageCropEditor` component with lazy loading
- Updated `ImageUpload` component with two-stage upload flow

## 4.3.0 - 2026-02-14

### Added

- Avatar upload feature - Users can now upload custom profile pictures
  - Dual-size image generation: 40x40px thumbnail and 240x240px standard
  - Automatic WebP conversion for optimal file size
  - Profile page displays 128px avatar (using 240px source), other areas use 40px thumbnail
  - Immediate refresh after upload using cache-busting
  - Self-hosted storage in rides-api
  - Backwards compatible with existing Gravatar, Auth0, and base64 images

### Changed

- Profile page avatar display increased to 128px (w-32)
- Profile form layout redesigned with responsive grid
  - Mobile: Avatar at top, form fields below (full width)
  - Desktop (lg): Equal 50/50 split with avatar on right
  - Avatar is now clickable button with "Click image to change" text
- Menu icon changed from Settings to User icon for Profile link
- Enhanced `resolveAvatarUrl()` utility to handle all avatar URL formats

### Fixed

- Restored avatar upload functionality (was deprecated in v4.0.0)

## 4.2.0 - 2026-02-10

### Added

- Copy ride link feature - Leaders/admins can copy a short URL to share rides (e.g., `/r/abc123`)

## 4.1.0 - 2026-02-09

### Added

- Copy ride link feature - Leaders/admins can copy a short URL to share rides (e.g., `/r/abc123`)

### Changed

- App uses Tanstack Start for routing and build; its a client-rendered app

### Removed

- NextJS

## 4.0.0 - 2026-02-08

### Breaking changes

- Created a separate rides-api repo to handle all RESTful API requests, and database schema. This repo is not client-rendered and relies on hooks to call APIs for data.

### Changed

- Auth uses Auth0 SPA SDK. JWTs are used for a session, with background refresh to avoid having to login too often
- All components use hooks for data fetching, via Tanstack Query
- Removed react-quill library; replaced with a lightweight markdown editor

### Removed

All server-side responsibilities:

- server actions, which were costing function executions
- drizzle schema and migrations
- postgres connections
- machine-machine auth with Auth0

Temporary deprecated features:

- Change avatar in profile (no image processing service)

## Previous Versions

- [Version 3 change log](./CHANGELOG-v3.md)
- [Version 2 change log](./CHANGELOG-v2.md)
- [Version 1 change log](./CHANGELOG-v1.md)
- [Version 0 change log](./CHANGELOG-v0.md)
