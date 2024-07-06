"use server";

import { rideFormSchema } from "@/components/forms/formSchemas";
import { NOT_AUTHORISED } from "@/constants";
import { db } from "@/server/db";
import { repeatingRides } from "@/server/db/schema";
import { makeRepeatingRide } from "@utils/forms";
import { repeatingRideToDb } from "@utils/repeatingRides";
import { canUseAction } from "../auth";

export const addRepeatingRide = async (data: FormData) => {
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
  const values = repeatingRideToDb(makeRepeatingRide(parsed.data));

  try {
    const result = await db
      .insert(repeatingRides)
      .values(values)
      .returning({ repeatingRideId: repeatingRides.id });

    return {
      success: true,
      id: result?.[0]?.repeatingRideId,
      message: "Repeating ride added",
    };
  } catch (error) {
    return {
      success: false,
      message: `Unable to add repeating ride`,
    };
  }
};
