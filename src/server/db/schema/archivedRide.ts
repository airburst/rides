import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import archivedUserOnRides from "./archivedUsersOnRide";
import { createTable } from "./create-table";

const archivedRides = createTable(
  "archived_rides",
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
    createdAt: timestamp({ precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (ride) => ({
    rideIndex: index().on(ride.name),
  }),
);

export const archivedRideRelations = relations(archivedRides, ({ many }) => ({
  users: many(archivedUserOnRides),
}));

export default archivedRides;
