import type { Area } from "@/types/crop";

/**
 * Creates a cropped image from a source image file using canvas
 * @param imageSrc - URL or data URL of the source image
 * @param croppedAreaPixels - The area to crop (from react-easy-crop)
 * @param targetSize - The target size for the output image (default 240)
 * @param quality - WebP quality 0-1 (default 0.85)
 * @returns A Blob containing the cropped WebP image
 */
export async function createCroppedImage(
  imageSrc: string,
  croppedAreaPixels: Area,
  targetSize = 240,
  quality = 0.85,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Set canvas size to target output size
      canvas.width = targetSize;
      canvas.height = targetSize;

      // Draw the cropped portion of the image, scaled to target size
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        targetSize,
        targetSize,
      );

      // Convert canvas to WebP blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to create blob from canvas"));
            return;
          }
          resolve(blob);
        },
        "image/webp",
        quality,
      );
    };

    image.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    image.src = imageSrc;
  });
}

/**
 * Converts a File to a data URL for use with the crop editor
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as data URL"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
