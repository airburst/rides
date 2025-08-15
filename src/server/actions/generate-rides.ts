"use server";

import { db } from "@/server/db";
import { repeatingRides, rides } from "@/server/db/schema";
import { type TemplateRide } from "@/types";
import { and, eq } from "drizzle-orm";
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
    // If no rides to create, just update the schedule
    if (data.length === 0) {
      await db
        .update(repeatingRides)
        .set({ schedule })
        .where(eq(repeatingRides.id, repeatingRideId));

      return {
        success: true,
        createdRides: 0,
        message: "No new rides to generate",
      };
    }

    // Create rides and update schedule (next start date)
    // in a transaction
    await db.transaction(async (tx) => {
      // Check for existing rides to prevent duplicates
      const existingRides = await tx.query.rides.findMany({
        columns: { rideDate: true },
        where: and(
          eq(rides.scheduleId, repeatingRideId),
          eq(rides.deleted, false),
        ),
      });

      const existingDates = new Set(existingRides.map((ride) => ride.rideDate));

      // Filter out rides that already exist
      const newRides = data.filter((ride) => !existingDates.has(ride.rideDate));

      if (newRides.length > 0) {
        const results = await tx
          .insert(rides)
          // @ts-expect-error insert values type
          .values(newRides)
          .returning({ rideId: rides.id });

        createdRides = results.length;
      }

      // Update the schedule with the new start date
      await tx
        .update(repeatingRides)
        .set({ schedule })
        .where(eq(repeatingRides.id, repeatingRideId));
    });

    return {
      success: true,
      createdRides,
      message:
        createdRides > 0
          ? `Generated ${createdRides} new rides`
          : "No new rides needed",
    };
  } catch (error) {
    console.error("💢 generate-rides", error);
    return {
      success: false,
      message: `Unable to generate rides`,
    };
  }
};
