import type { Db } from "..";
import { userOnRides } from "../schema";
import userRideData from "./data/usersOnRides.json";

export default async function seed(db: Db) {
  await db.insert(userOnRides).values(userRideData);
}
