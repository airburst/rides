"use server";

import { NOT_AUTHORISED } from "@/constants";
import { db } from "@/server/db";
import { userOnRides } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { canUseAction } from "../auth";

export const updateMessage = async (
  rideId: string,
  userId: string,
  notes: string,
): Promise<{
  success: boolean;
  error?: string;
}> => {
  // A user can only update their own record
  const isAuthorised = await canUseAction("ADMIN", userId);

  if (!isAuthorised) {
    return {
      success: false,
      error: NOT_AUTHORISED,
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
      error: `Unable to update message`,
    };
  }
};
