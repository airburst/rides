import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { createTable } from "./create-table";
import repeatingRides from "./repeatingRide";
import userOnRides from "./usersOnRide";

const rides = createTable(
  "rides",
  {
    id: t
      .text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: t.varchar({ length: 255 }).notNull(),
    rideGroup: t.varchar({ length: 255 }),
    rideDate: t
      .timestamp({
        precision: 3,
        mode: "string",
      })
      .notNull(),
    destination: t.varchar({ length: 255 }),
    distance: t.integer(),
    meetPoint: t.varchar({ length: 255 }),
    route: t.varchar({ length: 255 }),
    leader: t.varchar({ length: 255 }),
    notes: t.text(),
    rideLimit: t.integer().notNull().default(-1),
    deleted: t.boolean().notNull().default(false),
    cancelled: t.boolean().notNull().default(false),
    scheduleId: t.text(),
    createdAt: t
      .timestamp({ precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: t
      .timestamp({ precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [t.index().on(table.name)],
);

export const rideRelations = relations(rides, ({ one, many }) => ({
  users: many(userOnRides),
  repeatingRides: one(repeatingRides, {
    fields: [rides.scheduleId],
    references: [repeatingRides.id],
  }),
}));

export default rides;
