import type { Db } from "..";
import { users } from "../schema";
import userData from "./data/users.json";

export default async function seed(db: Db) {
  await db.insert(users).values(userData as (typeof users.$inferInsert)[]);
}
