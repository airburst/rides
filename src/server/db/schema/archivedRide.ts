import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";

import archivedUserOnRides from "./archivedUsersOnRide";
import { createTable } from "./create-table";

const archivedRides = createTable(
  "archived_rides",
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
    createdAt: t
      .timestamp({ precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [t.index().on(table.name)],
);

export const archivedRideRelations = relations(archivedRides, ({ many }) => ({
  users: many(archivedUserOnRides),
}));

export default archivedRides;
