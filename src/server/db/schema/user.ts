import { relations } from "drizzle-orm";
import { json, pgEnum, text, timestamp, varchar } from "drizzle-orm/pg-core";

import accounts from "./account";
import { createTable } from "./create-table";
import memberships from "./membership";
import sessions from "./session";
import userOnRides from "./usersOnRide";

export const roleEnum = pgEnum("role", ["USER", "LEADER", "ADMIN"]);

const users = createTable("users", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull(),
  emailVerified: timestamp({
    precision: 3,
    withTimezone: true,
  }).defaultNow(),
  image: text(),
  mobile: varchar({ length: 255 }),
  emergency: varchar({ length: 255 }),
  role: roleEnum().default("USER"),
  preferences: json().default({ units: "km" }),
  membershipId: text(),
  membershipStatus: varchar({ length: 255 }).default("NOT_MEMBER"),
  createdAt: timestamp({ precision: 3, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp({ precision: 3, mode: "string" }).defaultNow().notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  rides: many(userOnRides),
  memberships: many(memberships),
}));

export default users;
