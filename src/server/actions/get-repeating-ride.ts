"use server";

import { db } from "@/server/db";
import { type RepeatingRide, type RepeatingRideDb } from "@/types";
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

    return {
      ride: repeatingRideFromDb(result as RepeatingRideDb),
    };
  } catch (error) {
    return {
      ride: null,
      error: new Error("Unable to fetch rides"),
    };
  }
};
