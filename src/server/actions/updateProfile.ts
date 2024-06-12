"use server";

import { type Preferences } from "@/types";
import { updateUser } from "./updateUser";

export const updateProfile = async (formData: FormData) => {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const mobile = formData.get("mobile") as string;
  const emergency = formData.get("emergency") as string;
  const units = formData.get("units") as string;
  const preferences = { units } as Preferences;

  const result = await updateUser({ id, name, mobile, emergency, preferences });

  return result;
};
