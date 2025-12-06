import { env } from "@/env";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema/index";

export const db = drizzle(env.DATABASE_URL, { schema, casing: "snake_case" });

export type Db = typeof db;

export default db;
