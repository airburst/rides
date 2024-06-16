"use server";

import { db } from "@/server/db";
import { rides } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerAuthSession } from "../auth";

export const cancelRide = async (
  rideId: string,
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
  const hasLeaderRole = role === "LEADER" || role === "ADMIN";

  try {
    if (hasLeaderRole) {
      await db
        .update(rides)
        .set({ cancelled: true })
        .where(eq(rides.id, rideId));
      revalidatePath("/ride/[...id]", "page");

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
      error: new Error(`Unable to cancel ride id ${rideId}`),
    };
  }
};
