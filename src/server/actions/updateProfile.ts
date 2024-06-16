"use server";

import { userProfileFormSchema } from "@/components/forms/formSchemas";
import { updateUser } from "./updateUser";

export type FormState = {
  message: string;
};

export async function updateProfile(data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data);
  // Handle known JSON fields
  if (formData.preferences) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-base-to-string
    formData.preferences = JSON.parse(formData.preferences.toString());
  }

  const parsed = userProfileFormSchema.safeParse(formData);

  if (!parsed.success) {
    return { message: "Invalid form data" };
  }

  try {
    // @ts-expect-error preferences.units is a string
    await updateUser(parsed.data);

    return { message: "Profile updated" };
  } catch (error) {
    console.error("Unable to update profile", error);
    return { message: "Unable to update profile" };
  }
}
