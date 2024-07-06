"use server";

import { db } from "@/server/db";
import { repeatingRides, rides } from "@/server/db/schema";
import { type TemplateRide } from "@/types";
import { eq } from "drizzle-orm";
/**
 * NOTE: This action is designed to be called from an API
 * route, which conducts the auth checks for API KEY.
 * It has NO INTRINSIC AUTH CHECKS.
 */
export const generateRides = async (
  data: TemplateRide[],
  repeatingRideId: string,
  schedule: string,
) => {
  let createdRides = 0;

  try {
    // Create rides and update schedule (next start date)
    // in a transaction
    await db.transaction(async (tx) => {
      const results = await tx
        .insert(rides)
        // @ts-expect-error insert values type
        .values(data)
        .returning({ rideId: rides.id });

      createdRides = results.length;

      // Update the schedule with the new start date
      await tx
        .update(repeatingRides)
        .set({ schedule })
        .where(eq(repeatingRides.id, repeatingRideId));
    });

    return {
      success: true,
      createdRides,
      message: "Rides generated",
    };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return {
      success: false,
      message: `Unable to generate rides`,
    };
  }
};
