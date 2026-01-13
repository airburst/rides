# Rides App - Feature Documentation

Cycling club rides and events planner.

## Current Tech Stack

- Next.js 15 / React 19 / TypeScript
- PostgreSQL / Drizzle ORM
- NextAuth.js / Auth0
- Tailwind CSS / DaisyUI
- RRule (recurrence)
- Zod (validation)
- Jotai (state)

---

## Domain Model & Schemas

### Users

```typescript
{
  id: uuid,
  name: string,
  email: string,
  image: string | null,
  role: "USER" | "LEADER" | "ADMIN",
  mobile: string | null,
  emergencyContactName: string | null,
  emergencyContactNumber: string | null,
  membershipId: string | null,
  membershipStatus: "MEMBER" | "NOT_MEMBER" | "EXPIRED" | "OTHER_CLUB",
  preferences: { units: "km" | "miles" }
}
```

**Multi-tenant notes:**
- Add `tenantId` to scope users to organizations
- `membershipId` becomes tenant-specific
- Role hierarchy may need tenant-level customization

**Local-first notes:**
- User profile changes are low-conflict (single editor)
- Sync user data on login, cache locally
- `preferences` can be device-local until synced

---

### Rides

```typescript
{
  id: uuid,
  name: string,
  rideDate: ISO datetime string,  // includes time
  destination: string | null,
  distance: number | null,
  meetPoint: string | null,
  route: string | null,
  leader: string | null,
  notes: string | null,
  rideLimit: number,  // -1 = unlimited
  deleted: boolean,   // soft delete
  cancelled: boolean,
  scheduleId: uuid | null  // link to repeating ride template
}
```

**Multi-tenant notes:**
- Add `tenantId` to scope rides
- `scheduleId` reference must be tenant-scoped
- Consider tenant-specific ride fields/customization

**Local-first notes:**
- Rides are primarily read-heavy, edited by leaders only
- Conflict: same ride edited by two leaders → last-write-wins or merge
- `cancelled`/`deleted` flags: use CRDT set (once true, stays true)
- Cache upcoming rides locally for offline viewing

---

### Repeating Rides (Templates)

```typescript
{
  id: uuid,
  name: string,
  schedule: RRule string,  // e.g., "FREQ=WEEKLY;BYDAY=SA;INTERVAL=1"
  destination: string | null,
  distance: number | null,
  meetPoint: string | null,
  route: string | null,
  leader: string | null,
  notes: string | null,
  rideLimit: number,
  winterStartTime: string | null  // override time for winter months
}
```

**RRule fields parsed from schedule:**
- `freq`: WEEKLY | MONTHLY
- `interval`: number
- `byweekday`: MO, TU, WE, TH, FR, SA, SU (array)
- `dtstart`: start datetime

**Multi-tenant notes:**
- Add `tenantId`
- Templates are org-specific
- Winter time logic may vary by tenant location

**Local-first notes:**
- Templates rarely change, good cache candidates
- Generation happens server-side (not local)

---

### Users on Rides (Enrollment)

```typescript
{
  oderId: uuid,
  rideId: uuid,
  notes: string | null,  // rider-specific message
  createdAt: timestamp
}
```

**Multi-tenant notes:**
- Implicitly scoped via ride's tenantId
- Cross-tenant enrollment not allowed

**Local-first notes:**
- **High conflict potential**: multiple users joining same ride
- Capacity check: `rideLimit` enforcement needs server authority
- Strategy: optimistic local join → server validates → rollback if over capacity
- Use CRDTs: grow-only set for enrollments, separate set for leaves
- `notes` field: last-write-wins per user

---

### Membership (RiderHQ Integration)

```typescript
{
  system: "RiderHQ",
  memberId: string,
  memberHandle: string | null,
  firstName: string | null,
  lastName: string | null,
  email: string | null,
  isVerified: boolean,
  isGuest: boolean,
  expiry: date | null
}
```

**Multi-tenant notes:**
- Each tenant may have different membership provider
- `system` field allows multiple integrations
- Tenant-specific API credentials

**Local-first notes:**
- Server-only sync (not replicated to clients)
- Users see their own membership status cached in user record

---

### Archived Rides / Archived Users on Rides

Mirror schemas of `rides` and `users_on_rides` for historical data.

**Multi-tenant notes:**
- Archive tables need `tenantId` or partition by tenant

**Local-first notes:**
- Archives are read-only, no sync needed
- Load on-demand for historical views

---

## Core Features

### 1. Ride Management

| Action | Permission | Description |
|--------|------------|-------------|
| View rides | Public | List/calendar/detail views |
| Create ride | LEADER+ | Single ride with all fields |
| Edit ride | LEADER+ | Update any ride field |
| Delete ride | LEADER+ | Soft delete (sets `deleted=true`) |
| Cancel ride | LEADER+ | Marks `cancelled=true`, ride still visible |
| Copy ride | LEADER+ | Duplicate ride to new date |

**Business logic:**
- Rides with `deleted=true` excluded from all queries
- Cancelled rides shown with visual indicator
- `rideLimit=-1` means unlimited capacity

**Local-first notes:**
- Read operations fully offline-capable
- Write operations queue locally, sync when online
- Conflict resolution: leader edits win, or merge non-conflicting fields

---

### 2. Ride Enrollment

| Action | Permission | Description |
|--------|------------|-------------|
| Join ride | USER+ (self) | Add self to ride |
| Leave ride | USER+ (self) | Remove self from ride |
| Add rider | LEADER+ | Add any user to ride |
| Remove rider | LEADER+ | Remove any user from ride |
| Update notes | USER+ (self) | Edit own rider notes |

**Business logic:**
- Capacity check: `participants.length < rideLimit` (unless -1)
- `createdAt` used for waitlist ordering if over capacity
- Notes are per-user-per-ride

**Local-first notes:**
- **Critical sync area**: enrollment changes must sync reliably
- Optimistic UI: show join immediately, rollback on server rejection
- Capacity enforcement: server is source of truth
- Consider: reservation/lock mechanism for last spots

---

### 3. Repeating Ride Templates

| Action | Permission | Description |
|--------|------------|-------------|
| View templates | LEADER+ | List all templates |
| Create template | LEADER+ | New recurring schedule |
| Edit template | LEADER+ | Modify schedule/details |
| Delete template | ADMIN | Permanent delete |
| Copy template | LEADER+ | Duplicate with modifications |

**Business logic:**
- RRule stored as string, parsed for editing
- `winterStartTime` applied during generation for seasonal adjustment
- Template changes don't affect already-generated rides

---

### 4. Automatic Ride Generation

**Trigger:** Cron job on 1st of each month (runs twice at 02:05 and 02:10 UTC)

**Process:**
1. Fetch all repeating ride templates
2. For each template, generate RRule occurrences for next month
3. Check for existing rides on same dates (prevent duplicates)
4. Create ride records with template data
5. Link via `scheduleId`

**Multi-tenant notes:**
- Must iterate all tenants or run per-tenant
- Consider tenant timezone for "next month" calculation

**Local-first notes:**
- Server-only operation
- Clients receive new rides via normal sync

---

### 5. Calendar View

- Monthly grid display
- Rides shown as indicators on dates
- Navigation: prev/next month, jump to date
- Click date → rides list for that day

**Local-first notes:**
- Calendar data cacheable by month
- Pre-fetch adjacent months for smooth navigation

---

### 6. User Profiles

| Action | Permission | Description |
|--------|------------|-------------|
| View profile | Public | See user info (limited fields) |
| Edit own profile | USER+ | Update name, contact, preferences |
| Edit any profile | ADMIN | Full user editing |
| Upload avatar | USER+ (self) | Profile image |

**Fields:**
- Display: name, image
- Contact: mobile, emergency contact
- Preferences: distance units (km/miles)
- Membership: status display

---

### 7. User Management (Admin)

- Searchable user table
- Filter by name/email
- Edit user roles
- View membership status

**Multi-tenant notes:**
- Admin sees only tenant's users
- Super-admin for cross-tenant management

---

### 8. Ride Archiving

**Trigger:** Cron job on 1st of each month at 02:00 UTC

**Process:**
1. Find rides before current month
2. Copy to `archived_rides` table
3. Copy enrollments to `archived_users_on_rides`
4. Delete from live tables

**Multi-tenant notes:**
- Archive per-tenant or use tenant partition

**Local-first notes:**
- Clients can purge old local data after archive date

---

## Routes

### Public Pages

| Route | Description |
|-------|-------------|
| `/` | Home - rides list |
| `/rides/[...date]` | Rides on specific date |
| `/calendar` | Calendar view (current month) |
| `/calendar/[...date]` | Calendar at specific month |
| `/ride/[...id]` | Ride details |
| `/r/[...id]` | Short URL redirect to ride |
| `/profile/[...id]` | View user profile |

### Authenticated Pages

| Route | Permission | Description |
|-------|------------|-------------|
| `/profile` | USER+ | Own profile |

### Admin Pages

| Route | Permission | Description |
|-------|------------|-------------|
| `/ride/new` | LEADER+ | Create ride |
| `/ride/new/[...date]` | LEADER+ | Create ride on date |
| `/ride/edit/[...id]` | LEADER+ | Edit ride |
| `/ride/copy/[...id]` | LEADER+ | Copy ride |
| `/repeating-rides` | LEADER+ | Templates list |
| `/repeating-rides/[...id]` | LEADER+ | Template details |
| `/repeating-rides/edit/[...id]` | LEADER+ | Edit template |
| `/repeating-rides/copy/[...id]` | LEADER+ | Copy template |
| `/users` | ADMIN | User management |

---

## API Endpoints

### POST /api/generate

Generate rides from repeating templates.

**Auth:** Bearer token (API_KEY)

**Body:**
```json
{
  "date": "2024-02-01",      // optional, defaults to next month
  "scheduleId": "uuid"        // optional, generate single template
}
```

**Multi-tenant notes:**
- Add tenant context to request
- Validate API key per tenant

---

### POST /api/archive-rides

Archive old rides to historical tables.

**Auth:** Bearer token (API_KEY)

**Body:**
```json
{
  "date": "2024-01-01"        // optional, archive before this date
}
```

---

### POST /api/riderhq

Sync membership data from RiderHQ.

**Auth:** Bearer token (API_KEY)

**Process:**
1. Fetch paginated member list from RiderHQ API
2. Truncate existing membership table
3. Insert fresh data

**Multi-tenant notes:**
- RiderHQ credentials per tenant
- Don't truncate cross-tenant

---

## Authorization Model

### Roles

| Role | Level | Capabilities |
|------|-------|--------------|
| USER | 1 | View rides, join/leave, edit own profile |
| LEADER | 2 | + Create/edit/delete rides, manage templates |
| ADMIN | 3 | + User management, delete templates |

### Permission Check

```typescript
canUseAction(requiredRole, allowedUserId?)
// Returns true if:
// - User's role >= requiredRole, OR
// - User's ID === allowedUserId (self-action)
```

**Multi-tenant notes:**
- Roles scoped to tenant
- Consider: tenant-admin vs super-admin
- Cross-tenant actions need elevated permissions

---

## External Integrations

### Auth0

- OAuth 2.0 provider
- Handles authentication flow
- Profile data synced to users table

**Multi-tenant notes:**
- Single Auth0 tenant with org metadata, OR
- Separate Auth0 tenants per org

### RiderHQ

- Cycling club membership management
- REST API with Basic Auth
- Periodic sync to verify member status

**Multi-tenant notes:**
- Each tenant configures own RiderHQ credentials
- Abstract to support other membership systems

---

## Background Jobs (Cron)

| Job | Schedule | Action |
|-----|----------|--------|
| Archive rides | 1st of month, 02:00 UTC | Move old rides to archive |
| Generate rides | 1st of month, 02:05 & 02:10 UTC | Create next month's rides |
| Membership sync | Manual trigger | Refresh RiderHQ data |

**Multi-tenant notes:**
- Jobs run for all tenants or queue per-tenant
- Consider tenant timezone for scheduling

**Local-first notes:**
- All server-side, clients sync results

---

## Local-First Architecture Notes

### Sync Strategy

1. **Initial sync:** Full download of current/future rides + user's enrollments
2. **Incremental sync:** Poll for changes or use websockets/SSE
3. **Offline writes:** Queue mutations locally, replay on reconnect

### Conflict Resolution by Entity

| Entity | Strategy |
|--------|----------|
| Rides | Last-write-wins with field-level merge |
| Enrollments | CRDT set (add-wins), server validates capacity |
| User profiles | Last-write-wins (single editor) |
| Templates | Last-write-wins |

### Offline Capabilities

| Feature | Offline Support |
|---------|-----------------|
| View rides | Full (cached) |
| View calendar | Full (cached months) |
| Join/leave ride | Queued, optimistic UI |
| Create/edit ride | Queued (LEADER+) |
| User management | Online only |

### Sync Considerations

- **Enrollment capacity:** Server must validate, client shows optimistic then corrects
- **Ride cancellation:** Propagate quickly, consider push notifications
- **Archive boundary:** Clients can drop archived data locally

---

## Multi-Tenant Architecture Notes

### Required Schema Changes

Every table needs `tenantId`:
- `users` - tenant membership
- `rides` - tenant's rides
- `repeating_rides` - tenant's templates
- `users_on_rides` - implicitly via ride
- `membership` - tenant's member system
- `archived_*` - maintain tenant reference

### Tenant Isolation

- All queries filter by `tenantId`
- Foreign keys within tenant boundary
- Indexes include `tenantId` prefix

### Tenant Configuration

```typescript
{
  id: uuid,
  name: string,
  slug: string,  // subdomain or path
  settings: {
    clubName: string,
    timezone: string,
    membershipSystem: "RiderHQ" | "manual" | null,
    membershipApiCredentials: encrypted,
    authProvider: "Auth0" | "other",
    authConfig: encrypted
  }
}
```

### Cross-Tenant Concerns

- User may belong to multiple tenants (separate user records or junction table)
- Super-admin role for platform management
- Shared nothing vs shared infrastructure decision

---

## Key Business Logic

### Ride Readiness Check

Ride considered "ready" when:
- `leader` is not "TBA" or empty
- `route` is not "TBA" or empty

### Capacity Check

```typescript
hasSpace(ride) = ride.rideLimit === -1 || ride.participants.length < ride.rideLimit
```

### Winter Time Override

During ride generation, if current month is in winter range:
- Use `winterStartTime` instead of template's normal time
- Applied per-template

### Distance Conversion

- User preference: km or miles
- Display converts stored value (assumed km) to preferred unit

### Duplicate Prevention

During generation:
- Compare `rideDate` (YYYY-MM-DD) against existing rides
- Skip if ride already exists for that date + template
