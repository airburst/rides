"use server";

import { db } from "@/server/db";
import { userOnRides } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { canUseAction } from "../auth";

export const updateRideNotes = async (
  rideId: string,
  userId: string,
  notes: string,
): Promise<{
  success: boolean;
  error?: Error;
}> => {
  // A user can only update their own record
  const isAuthorised = await canUseAction("ADMIN", userId);

  if (!isAuthorised) {
    return {
      success: false,
      error: new Error("Not authorised to use this API"),
    };
  }

  try {
    await db
      .update(userOnRides)
      .set({ notes })
      .where(
        and(eq(userOnRides.rideId, rideId), eq(userOnRides.userId, userId)),
      );
    revalidatePath("/ride/[...id]", "page");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: new Error(`Unable to remove rider from ride id ${rideId}`),
    };
  }
};
