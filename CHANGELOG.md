# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 3.7.3 - 2025-04-02

### Updated

- Changed cron jobs to run after 2am on the first of each month, to avoid any isses with daylight savings.

## 3.7.2 - 2025-03-29

### Updated

- Updated eslint to v9
- Updated all linting rules and fixed raised issues

## 3.7.1 - 2025-03-29

### Updated

- Updated all dependencies, including NextJS and React
- Fixed linting issues in server actions

## 3.7.0 - 2025-03-28

### Changed

Updated Drizzle ORM schemas and connections

- [x] drizzle.config.ts (casing: "snake_case")
- [x] const db = drizzle( connection: "", casing: "snake_case")
- [x] Remove snake case from schema files
- [x] Update seed.ts
- [x] Update pump.ts
- [x] Updatearray syntax for table constraints
- [x] Move scripts to bin folder
- [x] Update Yarn to 4.7.0

## 3.6.1 - 2025-03-15

### Fixed

- Rides were incorrectly grouped in April and beyond, because a daylight savings offset was calculated from today, instead of the ride date.

## 3.6.0 - 2025-02-26

### Changed

- Don't display riders' tel numbers. Only show a Call button.

## 3.5.0 - 2025-02-24

### Added

- Optimistically update ride details page when a user joins or leaves. Gives impression of faster performance.

## 3.4.0 - 2025-02-02

### Added

- Added new membership statuses and icons to database schema as follows:

  - Member = sheild with tick (same as current)
  - Non-member = empty (same as current)
  - Expired = shield with exclamation, in red
  - Other club = handshake

- Updated user profile form and user management page to support filtering by membership status
- Added MembershipIcon component to show correct icon in cards and forms

### Fixed

- Cards respond to pressing on iOS devices again

## 3.3.2 - 2025-01-04

### Changed

- Changed toast messages to use rich colours.

## 3.3.1 - 2025-01-03

### Fixed

- Notes editor was broken (when editing a ride). Fixed by upgrading to the fork of react-quill-new.

## 3.3.0 - 2024-12-28

### Added

- Animate dialog entry with slide-up
- Updated NextJS to v15

## 3.2.3 - 2024-12-27

### Fixed

- Data pump copies production tables
- Dropped original (v2) tables
- Reduce padding on all dialogs
- Remove dynamic import from Notes viewer (fixes jank when loading ride details view)
- Set default text layout styles
- Remove unused dependencies (auto-animate, swr)

## 3.2.2 - 2024-12-18

### Added

- The list of ride cards on homepage will prefetch ride details pages when the scroll into view. This should make clicking through to a details page faster.

## 3.2.1 - 2024-12-15

### Fixed

- Force removal of service workers

## 3.2.0 - 2024-12-10

### Added

- Snow for Christmas

### Changed

- Increased short text in notes to 400 characters
- Updated Yarn version

## 3.1.2 - 2024-09-03

### Fixed

- Include empty JSON body in cron API requests; fixes scheduled ride generation and archival

## 3.1.1 - 2024-08-05

### Fixed

- Fixed issues with generating next months' repeating rides

## 3.1.0 - 2024-07-28

### Added

- Added filters for role and membership in Users page

## 3.0.2 - 2024-07-17

### Added

- Added a "show more / less" toggle in long notes

### Fixed

- Winter start time is preserved when editing Repeating Rides.
- Menu entry for "Edit Ride" will link to a ride or repeating ride, depending on current page

## 3.0.0 - 2024-07-16

### Breaking changes

- Changed database schema to rename columns with reserved names and implement foreign keys

### Added

- Users can change their profile image in Settings page
- User profiles include RiderHQ membership badge; user form includes RiderHQ id
- Added toast notifications for create, cancel and delete actions
- Added a rich text editor for ride notes
- Date headers are sticky on home page (rides list)
- Short (copied) ride links are shorter

### Changed

- Dropdown menu has been replaced with a sliding drawer menu
- Calendar is now full-screen layout, and remembers the month when using a "back" button after clicking into a day
- Changed appearance of Cancelled ride banner and no longer show riders section of cancelled rides in details view
- Upgraded to NextJS v15 App Router (from Pages Router)
- Upgraded to React v19 and implemented React Server Components for all server-based data fetches
- The project now uses Drizzle ORM instead of Prisma

### Removed

- Almost all APIs and hooks, which are no longer needed for data fetching
- Without APIs, there are dramatically fewer lambdas in the production infrastructure
- Removed "speed" from ride table schema

## Previous Versions

- [Version 2 change log](./CHANGELOG-v2.md)
- [Version 1 change log](./CHANGELOG-v1.md)
- [Version 0 change log](./CHANGELOG-v0.md)
