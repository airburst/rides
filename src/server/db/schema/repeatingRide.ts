import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { createTable } from "./create-table";
import rides from "./ride";

const repeatingRides = createTable(
  "repeating_rides",
  {
    id: t
      .text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: t.varchar({ length: 255 }).notNull(),
    schedule: t.text().notNull(),
    winterStartTime: t.varchar({ length: 255 }),
    rideGroup: t.varchar({ length: 255 }),
    destination: t.varchar({ length: 255 }),
    distance: t.integer(),
    meetPoint: t.varchar({ length: 255 }),
    route: t.varchar({ length: 255 }),
    leader: t.varchar({ length: 255 }),
    notes: t.text(),
    rideLimit: t.integer().default(-1).notNull(),
    createdAt: t
      .timestamp({ precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  },
  (table) => [t.index().on(table.name)],
);

export default repeatingRides;

export const repeatingRideRelations = relations(repeatingRides, ({ many }) => ({
  rides: many(rides),
}));
