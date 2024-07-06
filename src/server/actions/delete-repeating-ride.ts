"use server";

import { NOT_AUTHORISED } from "@/constants";
import { db } from "@/server/db";
import { repeatingRides, rides } from "@/server/db/schema";
import { getNow } from "@utils/dates";
import { and, eq, gt } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { canUseAction } from "../auth";

export const deleteRepeatingRide = async (
  repeatingRideId: string,
  deleteAllRides: boolean,
): Promise<{
  success: boolean;
  deletedRideCount?: number;
  error?: string;
}> => {
  const isAuthorised = await canUseAction("LEADER");
  let deletedRideCount = 0;

  if (!isAuthorised) {
    return {
      success: false,
      error: NOT_AUTHORISED,
    };
  }

  try {
    await db.transaction(async (tx) => {
      // If deleteAllRides is true, delete all future
      // rides with the scheduleId
      if (deleteAllRides) {
        const count = await tx
          .update(rides)
          .set({ deleted: true })
          .where(
            and(
              eq(rides.scheduleId, repeatingRideId),
              gt(rides.rideDate, getNow()),
            ),
          )
          .returning({ id: rides.id });

        deletedRideCount = count.length;
      }

      // Delete the repeating ride
      await tx
        .delete(repeatingRides)
        .where(eq(repeatingRides.id, repeatingRideId));
    });

    revalidatePath("/", "page");
    revalidatePath("/repeating-rides", "page");

    return {
      success: true,
      deletedRideCount,
    };
  } catch (error) {
    return {
      success: false,
      error: `Unable to delete ride id ${repeatingRideId}`,
    };
  }
};
