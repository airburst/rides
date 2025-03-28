import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { createTable } from "./create-table";
import users from "./user";

const sessions = createTable(
  "sessions",
  {
    sessionToken: t.varchar({ length: 255 }).notNull().primaryKey(),
    userId: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: t
      .timestamp({
        mode: "date",
        withTimezone: true,
      })
      .notNull(),
  },
  (table) => [t.index("session_userId_idx").on(table.userId)],
);

export const sessionRelations = relations(sessions, ({ one }) => ({
  users: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export default sessions;
