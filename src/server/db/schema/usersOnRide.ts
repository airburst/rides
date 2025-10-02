import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { createTable } from "./create-table";
import rides from "./ride";
import users from "./user";

const userOnRides = createTable(
  "users_on_rides",
  {
    userId: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    rideId: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => rides.id),
    notes: t.text(),
    createdAt: t
      .timestamp({ precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    t.primaryKey({ columns: [table.userId, table.rideId] }),
    t
      .index("idx_users_on_rides_ride_created")
      .on(table.rideId, table.createdAt),
  ],
);

export const userOnRidesRelations = relations(userOnRides, ({ one }) => ({
  user: one(users, {
    fields: [userOnRides.userId],
    references: [users.id],
  }),
  ride: one(rides, {
    fields: [userOnRides.rideId],
    references: [rides.id],
  }),
}));

export default userOnRides;
