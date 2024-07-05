"use server";

import { rideFormSchema } from "@/components/forms/formSchemas";
import { NOT_AUTHORISED } from "@/constants";
import { db } from "@/server/db";
import { rides } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { canUseAction } from "../auth";
import { type FormState } from "./update-profile";

export const addRide = async (data: FormData): Promise<FormState> => {
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
    await db.insert(rides).values(parsed.data).returning({ rideId: rides.id });

    revalidatePath("/", "page");

    return {
      success: true,
      message: "Ride added",
    };
  } catch (error) {
    return {
      success: false,
      message: `Unable to add ride`,
    };
  }
};
