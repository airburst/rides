"use server";

import { NOT_AUTHORISED } from "@/constants";
import { db } from "@/server/db";
import { userOnRides } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { canUseAction } from "../auth";

const joinSchema = z.object({
  userId: z.string(),
  rideId: z.string(),
});

type JoinType = z.infer<typeof joinSchema>;

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
      error: `Unable to remove rider from ride id ${rideId}`,
    };
  }
};
