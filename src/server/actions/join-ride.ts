"use server";

import { NOT_AUTHORISED } from "@/constants";
import { db } from "@/server/db";
import { userOnRides } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { canUseAction } from "../auth";

export const joinRide = async (
  rideId: string,
  userId: string,
): Promise<{
  success: boolean;
  error?: string;
}> => {
  // A user can only add themselves; a leader or admin can add other riders
  const isAuthorised = await canUseAction("LEADER", userId);

  if (!isAuthorised) {
    return {
      success: false,
      error: NOT_AUTHORISED,
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
      error: `Unable to add rider to ride id ${rideId}`,
    };
  }
};
