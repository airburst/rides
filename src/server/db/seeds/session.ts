import type db from "..";
import { sessions } from "../schema";
import data from "./data/session.json";

export default async function seed(db: db) {
  // @ts-expect-error json data is not typed
  await db.insert(sessions).values(data);
}
