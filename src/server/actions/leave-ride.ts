"use server";

import { NOT_AUTHORISED } from "@/constants";
import { db } from "@/server/db";
import { userOnRides } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { canUseAction } from "../auth";

type JoinType = {
  userId: string;
  rideId: string;
};

export const leaveRide = async ({
  rideId,
  userId,
}: JoinType): Promise<{
  success: boolean;
  error?: string;
}> => {
  // A user can only remove themselves; a leader or admin can remove other riders
  const isAuthorised = await canUseAction("LEADER", userId);

  if (!isAuthorised) {
    return {
      success: false,
      error: NOT_AUTHORISED,
    };
  }

  try {
    await db
      .delete(userOnRides)
      .where(and(eq(userOnRides.rideId, rideId), eq(userOnRides.userId, userId)));

    return {
      success: true,
    };
  } catch (error) {
    console.error("💢 leave-ride", error);
    return {
      success: false,
      error: `Unable to remove rider from ride id ${rideId}`,
    };
  }
};
