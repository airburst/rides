import { DAYS } from "@/constants";
import { findNextDay } from "@utils/dates";
import type db from "..";
import { rides } from "../schema";
import rideData from "./data/rides.json";

const getDay = (name: string) => {
  switch (name) {
    case "Sunday Ride":
      return DAYS.SUNDAY;
    case "Tuesday Ride":
      return DAYS.TUESDAY;
    case "Wednesday Social":
      return DAYS.WEDNESDAY;
    case "Thursday Beer and Pizza":
      return DAYS.THURSDAY;
    case "Friday Women (Shorter)":
      return DAYS.FRIDAY;
    default:
      return DAYS.SATURDAY;
  }
};

const getTimeFromDate = (date: string) => {
  const parts = date.split("T");
  return parts[1];
};

export default async function seed(db: db) {
  // Set a future ride date for each type of ride
  const ridesWithFutureDates = rideData.map((ride, index) => {
    const daysInAdvance = index > 17 ? 7 : 0;
    const day = getDay(ride.name);
    const date = findNextDay(day, daysInAdvance);
    const rideDate = date.split("T")[0] + "T" + getTimeFromDate(ride.rideDate);

    return {
      ...ride,
      rideDate,
    };
  });

  await db.insert(rides).values(ridesWithFutureDates);
}
