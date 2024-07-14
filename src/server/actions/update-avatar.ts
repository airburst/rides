"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import db from "../db";
import { users } from "../db/schema";

export type FormState = {
  message: string;
  success: boolean;
};

// Expects image to be a base64 string
export async function updateAvatar(id: string, image: string): Promise<FormState> {
  try {
    const parts = image.split(";");
    const mimeType = parts[0]?.split(":")[1];
    const imageData = parts[1]?.split(",")[1];
    const img = Buffer.from(imageData!, "base64");

    // Resize the image to 40x40 pixels
    const resizedBase64 = await sharp(img)
    .resize(40,40, {fit: "contain"})
    .toBuffer()
    .then(resizedImageBuffer => {
      const resizedImageData = resizedImageBuffer.toString("base64");
      return `data:${mimeType};base64,${resizedImageData}`;
    }).catch(error => {
      console.error("Error resizing image", error);
      return null;
    });
    console.log("🚀 ~ updateAvatar ~ resizedBase64:", resizedBase64); // FIXME:

    if (!resizedBase64) {
      return { message: "Unable to resize image", success: false };
    }

    await db
      .update(users)
      .set({ image: resizedBase64 })
      .where(eq(users.id, id))
      .returning({ id: users.id });

    // Revalidate the profile page so that updated info is displayed
    revalidatePath("/profile", "page");

    return { message: "Profile image updated", success: true };
  } catch (error) {
    console.error("Unable to update profile image", error);
    return { message: "Unable to update profile image", success: false };
  }
}
