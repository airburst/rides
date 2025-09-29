# TODO List

## Index improvement

1. rides table - Critical Performance Improvements
```sql
-- Most important: Date range queries with deleted filter
CREATE INDEX idx_rides_date_deleted ON rides (ride_date, deleted);

-- Schedule-based queries
CREATE INDEX idx_rides_schedule_deleted ON rides (schedule_id, deleted);

-- Short ID lookups (for get-ride-by-shortid.ts)
CREATE INDEX idx_rides_id_suffix ON rides USING btree (right(id, 6));
-- OR use a trigram index for LIKE '%shortid' patterns:
CREATE INDEX idx_rides_id_pattern ON rides USING gin (id gin_trgm_ops);
```

2. users table - Search Performance
```sql
-- User search by name/email (case-insensitive)
CREATE INDEX idx_users_name_lower ON users (lower(name));
CREATE INDEX idx_users_email_lower ON users (lower(email));

-- Membership-based queries
CREATE INDEX idx_users_membership_id ON users (membership_id) WHERE membership_id IS NOT NULL;
```

3. users_on_rides table - Join Optimization
```sql
-- Individual lookups by ride (already covered by composite PK)
-- Individual lookups by user (already covered by composite PK)
-- But add for created_at ordering within ride context
CREATE INDEX idx_users_on_rides_ride_created ON users_on_rides (ride_id, created_at);
```
4. archived_rides table - Archive Queries
```sql
-- Date-based archive queries
CREATE INDEX idx_archived_rides_date ON archived_rides (ride_date);
```

## Query Pattern Analysis
The most performance-critical queries I identified:
- get-rides.ts - Filters by date range + deleted status (lines 38-42)
- archive-rides.ts - Filters rides by date for archiving (line 21, 32)
- generate-rides.ts - Finds existing rides by scheduleId + deleted (line 25)
- get-ride-by-shortid.ts - LIKE pattern matching on ride ID (line 30)
- get-users.ts - Case-insensitive search on name/email (lines 40-41)

## Priority Implementation Order
1. HIGH PRIORITY: idx_rides_date_deleted - This will speed up your most common query (getting rides by date range)
1. HIGH PRIORITY: idx_users_name_lower and idx_users_email_lower - For user search functionality
1. MEDIUM PRIORITY: idx_rides_schedule_deleted - For repeating ride generation
1. MEDIUM PRIORITY: idx_rides_id_pattern - For short URL lookups
1. LOW PRIORITY: Archive-related indexes (less frequent operations)

## Implementation
You can add these indexes to your Drizzle schema like this:
```js
// In src/server/db/schema/ride.ts
const rides = createTable(
  "rides",
  {
    // ... existing columns
  },
  (table) => [
    t.index().on(table.name), // existing
    t.index("idx_rides_date_deleted").on(table.rideDate, table.deleted),
    t.index("idx_rides_schedule_deleted").on(table.scheduleId, table.deleted),
  ],
);
```

These indexes should significantly improve performance for your most common query patterns, especially date-range filtering and user searches.
