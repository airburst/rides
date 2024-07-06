"use server";

import { NOT_AUTHORISED } from "@/constants";
import { db } from "@/server/db";
import { repeatingRides } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { canUseAction } from "../auth";

export const deleteRepeatingRide = async (
  rideId: string,
  deleteAllRides: boolean,
): Promise<{
  success: boolean;
  error?: string;
}> => {
  const isAuthorised = await canUseAction("LEADER");

  console.log({ deleteAllRides }); // TODO: not implemented yet

  if (!isAuthorised) {
    return {
      success: false,
      error: NOT_AUTHORISED,
    };
  }

  try {
    await db.delete(repeatingRides).where(eq(repeatingRides.id, rideId));

    revalidatePath("/repeating-rides", "page");

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
