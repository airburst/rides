"use server";

import { db } from "@/server/db";
import { rides } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NOT_AUTHORISED } from "../../constants";
import { canUseAction } from "../auth";

export const cancelRide = async (
  rideId: string,
): Promise<{
  success: boolean;
  error?: string;
}> => {
  const isAuthorised = await canUseAction("LEADER");

  if (!isAuthorised) {
    return {
      success: false,
      error: NOT_AUTHORISED,
    };
  }

  try {
    await db.update(rides).set({ cancelled: true }).where(eq(rides.id, rideId));
    // TODO: Causes layout shift, need to fix
    revalidatePath("/ride/[...id]", "page");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: `Unable to cancel ride id ${rideId}`,
    };
  }
};
