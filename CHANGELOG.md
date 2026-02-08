# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

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

- Copy ride link (no shortener service)
- Change avatar in profile (no image processing service)

## Previous Versions

- [Version 3 change log](./CHANGELOG-v3.md)
- [Version 2 change log](./CHANGELOG-v2.md)
- [Version 1 change log](./CHANGELOG-v1.md)
- [Version 0 change log](./CHANGELOG-v0.md)
