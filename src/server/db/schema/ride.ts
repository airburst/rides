import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { createTable } from "./create-table";
import repeatingRides from "./repeatingRide";
import userOnRides from "./usersOnRide";

const rides = createTable(
  "rides",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar({ length: 255 }).notNull(),
    rideGroup: varchar({ length: 255 }),
    rideDate: timestamp({
      precision: 3,
      mode: "string",
    }).notNull(),
    destination: varchar({ length: 255 }),
    distance: integer(),
    meetPoint: varchar({ length: 255 }),
    route: varchar({ length: 255 }),
    leader: varchar({ length: 255 }),
    notes: text(),
    rideLimit: integer().notNull().default(-1),
    deleted: boolean().notNull().default(false),
    cancelled: boolean().notNull().default(false),
    scheduleId: text(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" })
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
