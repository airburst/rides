import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import accounts from "./account";
import { createTable } from "./create-table";
import memberships from "./membership";
import sessions from "./session";
import userOnRides from "./usersOnRide";

export const roleEnum = t.pgEnum("role", ["USER", "LEADER", "ADMIN"]);

const users = createTable("users", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: t.varchar({ length: 255 }),
  email: t.varchar({ length: 255 }).notNull(),
  emailVerified: t
    .timestamp({
      precision: 3,
      withTimezone: true,
    })
    .defaultNow(),
  image: t.text(),
  mobile: t.varchar({ length: 255 }),
  emergency: t.varchar({ length: 255 }),
  role: roleEnum().default("USER"),
  preferences: t.json().default({ units: "km" }),
  membershipId: t.text(),
  membershipStatus: t.varchar({ length: 255 }).default("NOT_MEMBER"),
  createdAt: t
    .timestamp({ precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: t
    .timestamp({ precision: 3, mode: "string" })
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
