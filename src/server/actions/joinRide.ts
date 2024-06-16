"use server";

import { db } from "@/server/db";
import { userOnRides } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { getServerAuthSession } from "../auth";

export const joinRide = async (
  rideId: string,
  userId: string,
): Promise<{
  success: boolean;
  error?: Error;
}> => {
  const session = await getServerAuthSession();
  const role = session?.user!.role;

  if (!role) {
    return {
      success: false,
      error: new Error("Not authorised to use this API"),
    };
  }
  // A user can only add themselves; a leader or admin can add other riders
  const isMyRecord = session?.user.id === userId;
  const hasLeaderRole = role === "LEADER" || role === "ADMIN";

  try {
    if (isMyRecord || hasLeaderRole) {
      await db.insert(userOnRides).values({ rideId, userId });
      revalidatePath("/ride/[...id]");

      return {
        success: true,
      };
    }
    return {
      success: false,
      error: new Error("Not authorised to use this API"),
    };
  } catch (error) {
    return {
      success: false,
      error: new Error(`Unable to add rider to ride id ${rideId}`),
    };
  }
};
