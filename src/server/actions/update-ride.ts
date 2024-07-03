"use server";

import { rideFormSchema } from "@/components/forms/formSchemas";
import { NOT_AUTHORISED } from "@/constants";
import { db } from "@/server/db";
import { rides } from "@/server/db/schema";
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
    const { id, ...ride } = parsed.data;

    if (!id) {
      return {
        success: false,
        message: `Ride id is missing`,
      };
    }

    await db
      .update(rides)
      .set({ ...ride })
      .where(eq(rides.id, id))
      .returning({ id: rides.id });

    revalidatePath(`/ride/${id}`, "page");

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
