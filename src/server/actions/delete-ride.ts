"use server";

import { NOT_AUTHORISED } from "@/constants";
import { db } from "@/server/db";
import { rides } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { canUseAction } from "../auth";

export const deleteRide = async (
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
    await db
      .update(rides)
      .set({ deleted: true })
      .where(eq(rides.id, rideId));

    revalidatePath("/ride/[...id]", "page");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: `Unable to delete ride id ${rideId}`,
    };
  }
};
