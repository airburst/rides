import { relations } from "drizzle-orm";
import { index, integer, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createTable } from "./create-table";
import rides from "./ride";

const repeatingRides = createTable(
  "repeating_rides",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar({ length: 255 }).notNull(),
    schedule: text().notNull(),
    winterStartTime: varchar({ length: 255 }),
    rideGroup: varchar({ length: 255 }),
    destination: varchar({ length: 255 }),
    distance: integer(),
    meetPoint: varchar({ length: 255 }),
    route: varchar({ length: 255 }),
    leader: varchar({ length: 255 }),
    notes: text(),
    rideLimit: integer().default(-1).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (ride) => ({
    repeatingRideIndex: index().on(ride.name),
  }),
);

export default repeatingRides;

export const repeatingRideRelations = relations(repeatingRides, ({ many }) => ({
  rides: many(rides),
}));
