import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import rides from "./ride";

const repeatingRides = pgTable(
  "repeating_rides",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    schedule: text("schedule").notNull(),
    winterStartTime: varchar("winter_start_time", { length: 255 }),
    rideGroup: varchar("ride_group", { length: 255 }),
    destination: varchar("destination", { length: 255 }),
    distance: integer("distance"),
    meetPoint: varchar("meet_point", { length: 255 }),
    route: varchar("route", { length: 255 }),
    leader: varchar("leader", { length: 255 }),
    notes: text("notes"),
    rideLimit: integer("ride_limit").default(-1).notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (ride) => ({
    repeatingRideIndex: index().on(ride.name),
  }),
);

export default repeatingRides;

export const repeatingRideRelations = relations(repeatingRides, ({ many }) => ({
  rides: many(rides),
}));
