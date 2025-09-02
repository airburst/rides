import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";
import { createTable } from "./create-table";
import users from "./user";

const accounts = createTable(
  "accounts",
  {
    userId: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: t.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: t.varchar({ length: 255 }).notNull(),
    providerAccountId: t
      .varchar({
        length: 255,
      })
      .notNull(),
    refresh_token: t.text(),
    access_token: t.text(),
    expires_at: t.integer(),
    token_type: t.varchar({ length: 255 }),
    scope: t.varchar({ length: 255 }),
    id_token: t.text(),
    session_state: t.varchar({ length: 255 }),
  },
  (table) => [
    t.primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
    t.index("account_userId_idx").on(table.userId),
  ],
);

export const accountRelations = relations(accounts, ({ one }) => ({
  users: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export default accounts;
