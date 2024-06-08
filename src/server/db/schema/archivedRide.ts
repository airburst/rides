import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import archivedUserOnRides from "./archivedUsersOnRide";

const archivedRides = pgTable(
  "archived_rides",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    rideGroup: varchar("ride_group", { length: 255 }),
    rideDate: timestamp("ride_date").notNull(),
    destination: varchar("destination", { length: 255 }),
    distance: integer("distance"),
    meetPoint: varchar("meet_point", { length: 255 }),
    route: varchar("route", { length: 255 }),
    leader: varchar("leader", { length: 255 }),
    notes: text("notes"),
    speed: integer("speed"), // TODO: Deprecate
    limit: integer("limit").notNull().default(-1),
    deleted: boolean("deleted").notNull().default(false),
    cancelled: boolean("cancelled").notNull().default(false),
    scheduleId: varchar("schedule_id", { length: 255 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (ride) => ({
    rideIndex: index().on(ride.name),
  }),
);

export const archivedRideRelations = relations(archivedRides, ({ many }) => ({
  users: many(archivedUserOnRides),
}));

export default archivedRides;
