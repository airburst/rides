import * as t from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";
import archivedRides from "./archivedRide";
import { createTable } from "./create-table";
import users from "./user";

const archivedUserOnRides = createTable(
  "archived_users_on_rides",
  {
    userId: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    rideId: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => archivedRides.id),
    notes: t.text(),
    createdAt: t
      .timestamp({ precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [t.primaryKey({ columns: [table.userId, table.rideId] })],
);

export const archivedUserOnRidesRelations = relations(
  archivedUserOnRides,
  ({ one }) => ({
    user: one(users, {
      fields: [archivedUserOnRides.userId],
      references: [users.id],
    }),
    ride: one(archivedRides, {
      fields: [archivedUserOnRides.rideId],
      references: [archivedRides.id],
    }),
  }),
);

export default archivedUserOnRides;
