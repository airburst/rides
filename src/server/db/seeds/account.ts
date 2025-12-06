import type { Db } from "..";
import { accounts } from "../schema";
import data from "./data/accounts.json";

export default async function seed(db: Db) {
  await db.insert(accounts).values(data as (typeof accounts.$inferInsert)[]);
}
