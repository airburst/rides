"use server";

import { userProfileFormSchema } from "@/components/forms/formSchemas";
import { revalidatePath } from "next/cache";
import { updateUser } from "./updateUser";

export type FormState = {
  message: string;
  success: boolean;
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
    return { message: "Invalid form data", success: false };
  }

  try {
    // @ts-expect-error preferences.units is a string
    await updateUser(parsed.data);
    // Revalidate the profile page so that updated info is displayed
    revalidatePath("/profile", "page");

    return { message: "Profile updated", success: true };
  } catch (error) {
    console.error("Unable to update profile", error);
    return { message: "Unable to update profile", success: false };
  }
}
