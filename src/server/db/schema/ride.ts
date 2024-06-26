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

import repeatingRides from "./repeatingRide";
import userOnRides from "./usersOnRide";

const rides = pgTable(
  "rides",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    rideGroup: varchar("ride_group", { length: 255 }),
    rideDate: timestamp("ride_date", {
      precision: 3,
      mode: "string",
    }).notNull(),
    destination: varchar("destination", { length: 255 }),
    distance: integer("distance"),
    meetPoint: varchar("meet_point", { length: 255 }),
    route: varchar("route", { length: 255 }),
    leader: varchar("leader", { length: 255 }),
    notes: text("notes"),
    rideLimit: integer("ride_limit").notNull().default(-1),
    deleted: boolean("deleted").notNull().default(false),
    cancelled: boolean("cancelled").notNull().default(false),
    scheduleId: text("schedule_id"),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (ride) => ({
    rideIndex: index().on(ride.name),
  }),
);

export const rideRelations = relations(rides, ({ one, many }) => ({
  users: many(userOnRides),
  repeatingRides: one(repeatingRides, {
    fields: [rides.scheduleId],
    references: [repeatingRides.id],
  }),
}));

export default rides;
