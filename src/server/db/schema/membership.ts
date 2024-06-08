import { boolean, pgTable, text } from "drizzle-orm/pg-core";

const membership = pgTable("membership", {
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

export default membership;
