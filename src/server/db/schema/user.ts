import { relations } from "drizzle-orm";
import {
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import accounts from "./account";
import sessions from "./session";
import userOnRides from "./usersOnRide";

export const roleEnum = pgEnum("role", ["USER", "LEADER", "ADMIN"]);

const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  image: varchar("image", { length: 255 }),
  mobile: varchar("mobile", { length: 255 }),
  emergency: varchar("emergency", { length: 255 }),
  role: roleEnum("role").default("USER"),
  preferences: json("preferences"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  rides: many(userOnRides),
}));

export default users;
