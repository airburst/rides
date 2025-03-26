import { defineConfig } from "drizzle-kit";

import { env } from "@/env";

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/server/db/schema/index.ts",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  casing: "snake_case",
  // tablesFilter: ["bcc3_*"],
  // migrations: {
  //   prefix: "timestamp",
  //   table: "__drizzle_migrations__",
  //   schema: "public",
  // },
});
