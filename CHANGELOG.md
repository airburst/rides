# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 2.5.0- 2024-06-07

### Added

- Leaders and Admins can now edit repeating rides

## 2.4.0- 2024-06-06

### Changed

- Updated all dependencies; keeping things in order

## 2.3.0- 2024-04-15

### Changed

- Rides are now sorted by name (asc) and distance (desc)

## 2.2.1 - 2024-03-19

### Changed

- Updated message chat bubble style and added basic avatar support

## 2.2.0 - 2024-03-16

### Changed

- Messages use chat bubble style.

## 2.1.0 - 2024-10-16

### Changed

- Migrates database from hosted MySQL (PlanetScale) to hosted Postgres (Supabase) due to end of free tier.

## [2.0.1] - 2023-09-02

### Changed

- Updated libraries to latest versions (Next, next-auth, Prisma, etc.)

## [2.0.0] - 2023-08-20

This is a major release with breaking changes to the way that repeating rides are managed in the app.

Admin users can now create, copy and delete repeating rides with scheduling rules (weekly or monthly).

Cron-triggered actions to generate rides use the new data model.

### Note

It is currently not possible to edit a repeating ride due to the complexities of updating ride instances, which may have already been joined by riders.

### Added

- Added RepeatingRide table, to hold scheduled ride templates
- Added optional scheduleId column to Rides, to denote that they are instances of a repeating ride
- Added apis for crud actions on repeating rides, along with a generate endpoint, which calculates all ride instances for each ride in a period and adds them to the Ride table
- Added pages to create, copy and delete repeating rides

### Changed

- Renamed cron action to `generate-rides` and pointed it to the new generate API endpoint
- Separated archive action

### Removed

- Delete all static configuration for scheduled rides
- Deleted apis and utilities to generate rides based on old configuration

## Previous Versions

- [Version 1 change log](./CHANGELOG-v1.md)
- [Version 0 change log](./CHANGELOG-v0.md)
