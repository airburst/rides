import type db from "..";
import { rides } from "../schema";
import rideDate from "./data/rides.json";

export default async function seed(db: db) {
  await db.insert(rides).values(rideDate);
}
