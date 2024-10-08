import { relations } from "drizzle-orm";
import { boolean, text } from "drizzle-orm/pg-core";
import { createTable } from "./create-table";
import users from "./user";

const memberships = createTable("membership", {
  system: text("system").notNull().default("RiderHQ"),
  memberId: text("member_id").primaryKey().notNull(),
  userId: text("user_id").notNull(),
  handle: text("handle").notNull(),
  isUser: boolean("is_user").notNull(),
  firstnames: text("firstnames").notNull(),
  lastname: text("lastname").notNull(),
  email: text("email").notNull(),
  expires: text("expires"),
  isVerified: boolean("is_verified"),
  isGuest: boolean("is_guest"),
});

export const membershipRelations = relations(memberships, ({ one }) => ({
  users: one(users, {
    fields: [memberships.memberId],
    references: [users.membershipId],
  }),
}));

export default memberships;
