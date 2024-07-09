"use server";

import { rideFormSchema } from "@/components/forms/formSchemas";
import { NOT_AUTHORISED } from "@/constants";
import { db } from "@/server/db";
import { repeatingRides } from "@/server/db/schema";
import { makeRepeatingRide } from "@utils/forms";
import { cleanUndefinedKeys } from "@utils/general";
import { repeatingRideToDb } from "@utils/repeatingRides";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { canUseAction } from "../auth";

export const updateRepeatingRide = async (data: FormData) => {
  const isAuthorised = await canUseAction("LEADER");

  if (!isAuthorised) {
    return {
      success: false,
      message: NOT_AUTHORISED,
    };
  }

  const formData = Object.fromEntries(data);
  const parsed = rideFormSchema.safeParse(formData);

  if (!parsed.success) {
    return { message: "Invalid form data", success: false };
  }

  // Convert data into repeating rides schema
  const { id } = parsed.data;
  const values = repeatingRideToDb(makeRepeatingRide(parsed.data));

  if (!id) {
    return {
      success: false,
      message: `Repeating ride id is missing`,
    };
  }

  try {
    const rideId = id;
    const result =  await db
    .update(repeatingRides)
    .set(cleanUndefinedKeys(values))
    .where(eq(repeatingRides.id, rideId))
    .returning({ repeatingRideId: repeatingRides.id });

    revalidatePath(`/repeating-ride/${rideId}`, "page");
    revalidatePath(`/repeating-rides`, "page");

    return {
      success: true,
      id: result?.[0]?.repeatingRideId,
      message: "Repeating ride updated",
    };
  } catch (error) {
    return {
      success: false,
      message: `Unable to update repeating ride`,
    };
  }
};
