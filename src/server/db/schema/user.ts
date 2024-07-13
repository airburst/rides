import { relations } from "drizzle-orm";
import { json, pgEnum, text, timestamp, varchar } from "drizzle-orm/pg-core";

import accounts from "./account";
import { createTable } from "./create-table";
import memberships from "./membership";
import sessions from "./session";
import userOnRides from "./usersOnRide";

export const roleEnum = pgEnum("role", ["USER", "LEADER", "ADMIN"]);

const users = createTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    precision: 3,
    withTimezone: true,
  }).defaultNow(),
  image: text("image"),
  mobile: varchar("mobile", { length: 255 }),
  emergency: varchar("emergency", { length: 255 }),
  role: roleEnum("role").default("USER"),
  preferences: json("preferences").default({ units: "km" }),
  membershipId: text("membership_id"),
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  rides: many(userOnRides),
  memberships: many(memberships),
}));

export default users;
