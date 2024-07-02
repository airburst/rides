import { primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { createTable } from "./create-table";

const verificationTokens = createTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      precision: 3,
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export default verificationTokens;
