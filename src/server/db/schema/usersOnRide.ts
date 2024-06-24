import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";
import rides from "./ride";
import users from "./user";

const userOnRides = pgTable(
  "users_on_rides",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    rideId: varchar("ride_id", { length: 255 })
      .notNull()
      .references(() => rides.id),
    notes: text("notes"),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (pk) => ({ pk: primaryKey({ columns: [pk.userId, pk.rideId] }) }),
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
