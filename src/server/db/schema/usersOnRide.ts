import { primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";
import { createTable } from "./create-table";
import rides from "./ride";
import users from "./user";

const userOnRides = createTable(
  "users_on_rides",
  {
    userId: varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    rideId: varchar({ length: 255 })
      .notNull()
      .references(() => rides.id),
    notes: text(),
    createdAt: timestamp({ precision: 3, mode: "string" })
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
