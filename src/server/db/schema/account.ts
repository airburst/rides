import { relations } from "drizzle-orm";
import { index, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { createTable } from "./create-table";
import users from "./user";

const accounts = createTable(
  "accounts",
  {
    userId: varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: varchar({ length: 255 }).notNull(),
    providerAccountId: varchar({
      length: 255,
    }).notNull(),
    refresh_token: text(),
    access_token: text(),
    expires_at: integer(),
    token_type: varchar({ length: 255 }),
    scope: varchar({ length: 255 }),
    id_token: text(),
    session_state: varchar({ length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountRelations = relations(accounts, ({ one }) => ({
  users: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export default accounts;
