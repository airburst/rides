import { relations } from "drizzle-orm";
import { boolean, text } from "drizzle-orm/pg-core";
import { createTable } from "./create-table";
import users from "./user";

const memberships = createTable("membership", {
  system: text().notNull().default("RiderHQ"),
  memberId: text().primaryKey().notNull(),
  userId: text().notNull(),
  handle: text().notNull(),
  isUser: boolean().notNull(),
  firstnames: text().notNull(),
  lastname: text().notNull(),
  email: text().notNull(),
  expires: text(),
  isVerified: boolean(),
  isGuest: boolean(),
});

export const membershipRelations = relations(memberships, ({ one }) => ({
  users: one(users, {
    fields: [memberships.memberId],
    references: [users.membershipId],
  }),
}));

export default memberships;
