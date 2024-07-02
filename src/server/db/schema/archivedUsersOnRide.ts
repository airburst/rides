import { primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";
import archivedRides from "./archivedRide";
import { createTable } from "./create-table";
import users from "./user";

const archivedUserOnRides = createTable(
  "archived_users_on_rides",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    rideId: varchar("ride_id", { length: 255 })
      .notNull()
      .references(() => archivedRides.id),
    notes: text("notes"),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (pk) => ({ pk: primaryKey({ columns: [pk.userId, pk.rideId] }) }),
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
