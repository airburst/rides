import { DATABASE_PREFIX } from "@/constants";
import { pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator(
  (name) => `${DATABASE_PREFIX}${name}`,
);
