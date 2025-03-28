import * as t from "drizzle-orm/pg-core";
import { createTable } from "./create-table";

const verificationTokens = createTable(
  "verification_tokens",
  {
    identifier: t.varchar({ length: 255 }).notNull(),
    token: t.varchar({ length: 255 }).notNull(),
    expires: t
      .timestamp({
        precision: 3,
        withTimezone: true,
      })
      .notNull(),
  },
  (vt) => [t.primaryKey({ columns: [vt.identifier, vt.token] })],
);

export default verificationTokens;
