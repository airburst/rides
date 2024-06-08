import type db from "..";
import { userOnRides } from "../schema";
import userRideData from "./data/usersOnRides.json";

export default async function seed(db: db) {
  await db.insert(userOnRides).values(userRideData);
}
