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
    // Check for existing rides to prevent duplicates
    const existingRides = await db
      .select({ rideDate: rides.rideDate })
      .from(rides)
      .where(
        and(eq(rides.scheduleId, repeatingRideId), eq(rides.deleted, false)),
      );

    const existingDates = new Set(
      existingRides.map((ride) => ride.rideDate.split("T")[0]),
    );

    // Filter out rides that already exist
    const newRides = data.filter((ride) => {
      const rideDate = ride.rideDate.split("T")[0];
      return !existingDates.has(rideDate);
    });

    if (newRides.length === 0) {
      // No new rides to create, don't update the schedule
      return {
        success: true,
        createdRides: 0,
        message: "No new rides to generate (duplicates skipped)",
      };
    }

    // Create rides and update schedule (next start date)
    // in a transaction
    await db.transaction(async (tx) => {
      const results = await tx
        .insert(rides)
        // @ts-expect-error insert values type
        .values(newRides)
        .returning({ rideId: rides.id });

      createdRides = results.length;

      // Update the schedule with the new start date
      await tx
        .update(repeatingRides)
        .set({ schedule })
        .where(eq(repeatingRides.id, repeatingRideId));
    });

    const skippedCount = data.length - newRides.length;
    const message =
      skippedCount > 0
        ? `Rides generated (${skippedCount} duplicates skipped)`
        : "Rides generated";

    return {
      success: true,
      createdRides,
      message,
    };
  } catch (error) {
    console.error("💢 generate-rides", error);
    return {
      success: false,
      message: `Unable to generate rides`,
    };
  }
};
