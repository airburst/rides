"use server";

import { rideFormSchema } from "@/components/forms/formSchemas";
import { NOT_AUTHORISED } from "@/constants";
import { db } from "@/server/db";
import { rides } from "@/server/db/schema";
import { cleanUndefinedKeys } from "@utils/general";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { canUseAction } from "../auth";
import { type FormState } from "./update-profile";

export const updateRide = async (data: FormData): Promise<FormState> => {
  const formData = Object.fromEntries(data);
  const parsed = rideFormSchema.safeParse(formData);
  const isAuthorised = await canUseAction("LEADER");

  if (!parsed.success) {
    return { message: "Invalid form data", success: false };
  }

  if (!isAuthorised) {
    return {
      success: false,
      message: NOT_AUTHORISED,
    };
  }

  try {
    const { id, ...ride } = cleanUndefinedKeys(parsed.data);

    if (!id) {
      return {
        success: false,
        message: `Ride id is missing`,
      };
    }

    const rideId = id as string;

    await db
      .update(rides)
      .set({ ...ride })
      .where(eq(rides.id, rideId))
      .returning({ id: rides.id });

    revalidatePath(`/ride/${rideId}`, "page");

    return {
      success: true,
      message: "Ride updated",
    };
  } catch (error) {
    return {
      success: false,
      message: `Unable to update ride`,
    };
  }
};
