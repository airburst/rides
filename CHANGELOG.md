# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 4.3.0 - 2026-02-14

### Added

- Avatar upload feature - Users can now upload custom profile pictures
  - Dual-size image generation: 40x40px thumbnail and 120x120px standard
  - Automatic WebP conversion for optimal file size
  - Profile page displays larger 120px version, other areas use 40px thumbnail
  - Immediate refresh after upload using cache-busting
  - Self-hosted storage in rides-api
  - Backwards compatible with existing Gravatar, Auth0, and base64 images

### Changed

- Profile page avatar display increased from 40px to 80px (using 120px source)
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
