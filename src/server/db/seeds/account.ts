import type db from "..";
import { accounts } from "../schema";
import data from "./data/accounts.json";

export default async function seed(db: db) {
  // @ts-expect-error json data is not typed
  await db.insert(accounts).values(data);
}
