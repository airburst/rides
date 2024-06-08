import type db from "..";
import { users } from "../schema";
import userData from "./data/users.json";

export default async function seed(db: db) {
  // @ts-expect-error json data is not typed
  await db.insert(users).values(userData);
}
