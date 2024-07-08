# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 3.0.0-alpha.1 - 2024-06-21

### Breaking changes

- Changed database schema to rename columns with reserved names and implement foreign keys

### Added

- User profiles include RiderHQ membership badge; user form includes RiderHQ id
- Added toast notifications for create, cancel and delete actions
- Added a rich text editor for ride notes
- Date headers are sticky on home page (rides list)

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
