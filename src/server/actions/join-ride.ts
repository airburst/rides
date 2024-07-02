"use server";

import { db } from "@/server/db";
import { userOnRides } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { canUseAction } from "../auth";

export const joinRide = async (
  rideId: string,
  userId: string,
): Promise<{
  success: boolean;
  error?: Error;
}> => {
  // A user can only add themselves; a leader or admin can add other riders
  const isAuthorised = await canUseAction("LEADER", userId);

  if (!isAuthorised) {
    return {
      success: false,
      error: new Error("Not authorised to use this API"),
    };
  }

  try {
    await db.insert(userOnRides).values({ rideId, userId });
    revalidatePath("/ride/[...id]", "page");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: new Error(`Unable to add rider to ride id ${rideId}`),
    };
  }
};
