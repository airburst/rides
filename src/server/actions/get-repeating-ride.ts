"use server";

import { db } from "@/server/db";
import type { RepeatingRide, RepeatingRideDb } from "@/types";
import { repeatingRideFromDb } from "@utils/repeatingRides";
import { eq } from "drizzle-orm";
import { repeatingRides } from "../db/schema";

export const getRepeatingRide = async (
  id: string,
): Promise<{
  ride: RepeatingRide | null;
  error?: Error;
}> => {
  try {
    const result = await db.query.repeatingRides.findFirst({
      where: eq(repeatingRides.id, id),
    });

    if (!result) {
      return {
        ride: null,
        error: new Error(`Repeating ride with id ${id} not found`),
      };
    }

    return {
      ride: repeatingRideFromDb(result as RepeatingRideDb),
    };
  } catch (error) {
    console.error("💢 get-repeating-ride", error);
    return {
      ride: null,
      error: new Error("Unable to fetch rides"),
    };
  }
};
