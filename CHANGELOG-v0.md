# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.22.2]

### Changed

- Route link for saturday social shorter group
- Change "Meeitng point" label to "Meet at" (for space)

## [0.22.0]

### Added

- A user can set notes for a ride
- User table can store preferences. First one allows choice of units (km|miles)

### Changed

- Header is white-on-blue for mobile

## [0.21.2]

### Changed

- Going button label changed to "leave"

## [0.21.1]

### Fixed

- Hide join button for rides in the past.

## [0.21.0]

### Added

- Leaders can now copy any ride to pre-populate a new ride form.
- Rides in the past cannot be edited or deleted, but can be copied
- All signed-in users can see the calendar
- Historic calendar days show greyed out ride tags and counts

## [0.20.0]

### Added

- Clicking outside menu when open closes it. Pressing Escape button does the same.

## [0.19.3]

### Changed

- Updated baseline for Wednesday social and Friday ladies rides.

### Fixed

- Title of Profile page

## [0.19.2]

### Changed

- Rider mobile and emergency contact numbers are now callable links

## [0.19.1]

### Changed

- After deleting a ride, user is redirected back to last page. This is helpful when deleting multiple rides on teh same day from a calendar view.

## [0.19.0]

### Added

- Back button on ride details screen takes returns you to the position you left in the 'all rides' screen.

## [0.18.0]

### Added

- Toggle to show rider or emergency contact number

## [0.17.0]

### Changed

- Rides do not expire until end of day
- Paceline starts at 08:40 in winter

## [0.16.1]

### Changed

- Show full group name for Sunday rides
- Replace "ride not ready" warning icon with red left border on card

## [0.16.0]

### Changed

- Only leaders can see contact info for riders

## [0.15.0]

### Added

- Redirect user to complete their profile after initial sign up
- Mobile and emergency contact details are mandatory
- Added info alert on anonymous join page

## [0.14.0]

### Added

- Store anonymous rider details in their browser (localStorage)
- Use this to show whether they are going to rides and to auto-fill join form

## [0.13.0]

### Added

- Capture emergency contact number for users in profile
- Leaders can see emergency contact info in ride details view
- Allow anonymous users to join rides

## [0.12.0]

### Added

- Create full month of rides on schedule
- Added midweek rides (Tue, Wed ride and hills, Ladies Friday)

### Changed

- Default view is two weeks of rides ahead

## [0.11.3]

### Fixed

- Get last/next month fixed for calendar planner view

## [0.11.2]

### Changed

- Removed 'add all rides' paceline button from planner/{day} view. These rides will be added from a controlled cron job.
- Prevent adding a ride for an historic date

## [0.10.0]

### Added

- Validation for minimum ride distance
- Added notes and meeting point to rides
- Group is no longer mandatory
- Show notes section on ride details
- Replaced long press on cards with faster swipe detection; speeds up navigation to ride details page
- Added notes and meeting point to Paceline rides

## [0.7.0] - 2022-10-20

### Added

- /ride/planner/[date] view shows rides on a given day, and a button to add a new ride (populated with that date)
- Add Paceline rides in bulk from planner (if day is in future, is a Saturday and has no pre-existing PL rides)

## [0.6.2] - 2022-10-19

### Changed

- Use NextJS font optimization strategy for Google Font

## [0.6.1] - 2022-10-19

### Fixed

- Husky pre-commit setup

## [0.6.0] - 2022-10-19

Planner (calendar) API and view updated with working navigation and visual indication of rides on each day.

### Added

- /api/rides accepts a query string with `start` and `end` dates to return rides within the range
- Calendar navigation (next and last month) mutates rides queries, to refetch data if not cached
- Display rounded badge with ride counts on mobile and list of ride badges on larger screens
- Added styling for 'today' in calendar

## [Pre-0.6.0] - 2022-10-01

Created the project baseline in NextJS, using the T3 Stack (TypeScript, Prisma ORM, TailwindCSS and Next-auth) and connecting to a SQL database, hosted on PlanetScale. Added database authentiction using Auth0 and SWR for client-side queries and mutations.

Setup a core Layout with Header and Main content areas, with public APIs and pages for users as follows:

| Route      | Page                                                                    |
| ---------- | ----------------------------------------------------------------------- |
| /          | List of upcoming rides                                                  |
| /ride/{id} | Ride details, view of riders going ability to join/leave (if signed in) |

..and guarded APIs and pages for leaders as follows:

| Route           | Page                  |
| --------------- | --------------------- |
| /ride/new       | Form to create a ride |
| /ride/{id}/edit | Form to change a ride |
| /planner        | Calendar view         |
