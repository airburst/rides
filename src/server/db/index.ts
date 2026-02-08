import { env } from "@/env";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema/index";

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

export const db = drizzle(env.DATABASE_URL, { schema, casing: "snake_case" });

export type Db = typeof db;

export default db;
