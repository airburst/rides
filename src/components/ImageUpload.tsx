import { MAX_FILE_SIZE_IN_BYTES } from "@/constants";
import { useUploadAvatar } from "@/hooks/users";
import { createCroppedImage, readFileAsDataURL } from "@/lib/cropImage";
import { type User } from "@/types";
import type { Area } from "@/types/crop";
import { Upload, X } from "lucide-react";
import { type ChangeEvent, lazy, Suspense, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./Button";

const ImageCropEditor = lazy(() => import("./ImageCropEditor"));

export type ImageUploadProps = {
  user: User;
  onClose: () => void;
  onSuccess?: (image: string, imageLarge: string) => void;
};

const ImageUpload = ({ user, onClose, onSuccess }: ImageUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const uploadMutation = useUploadAvatar();

  const fileUploadRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > MAX_FILE_SIZE_IN_BYTES) {
        toast.error("File size too large (max 8MB)");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setSelectedFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImageSrc(dataUrl);
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error("Failed to load image");
    }
  };

  const handleCropComplete = (croppedArea: Area) => {
    setCroppedAreaPixels(croppedArea);
  };

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels || !selectedFile) {
      toast.error("Please select and crop an image first");
      return;
    }

    try {
      setIsProcessing(true);

      // Create cropped image blob
      const croppedBlob = await createCroppedImage(imageSrc, croppedAreaPixels);

      // Convert blob to file
      const croppedFile = new File([croppedBlob], selectedFile.name, {
        type: "image/webp",
      });

      uploadMutation.mutate(
        { userId: user.id, file: croppedFile },
        {
          onSuccess: (response: { image: string; imageLarge: string }) => {
            toast.success("Avatar updated successfully");
            onSuccess?.(response.image, response.imageLarge);
            onClose();
          },
          onError: (error: Error) => {
            console.error("Avatar upload error:", error);
            toast.error("Unable to upload image");
          },
          onSettled: () => {
            setIsProcessing(false);
          },
        },
      );
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to process image");
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setImageSrc(null);
    setCroppedAreaPixels(null);
    if (fileUploadRef.current) {
      fileUploadRef.current.value = "";
    }
  };

  const handleSelectClick = () => {
    fileUploadRef?.current?.click();
  };

  // Show crop editor if image is selected
  if (imageSrc) {
    return (
      <div className="space-y-4">
        <Suspense
          fallback={
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Loading crop editor...</p>
            </div>
          }
        >
          <ImageCropEditor
            imageSrc={imageSrc}
            onCropComplete={handleCropComplete}
          />
        </Suspense>

        <div className="flex gap-4 justify-end">
          <Button
            onClick={handleCancel}
            disabled={isProcessing || uploadMutation.isPending}
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={
              !croppedAreaPixels || isProcessing || uploadMutation.isPending
            }
            loading={isProcessing || uploadMutation.isPending}
          >
            <Upload className="w-4 h-4" />
            {isProcessing ? "Processing..." : "Save & Upload"}
          </Button>
        </div>
      </div>
    );
  }

  // Show file selection UI
  return (
    <div className="flex flex-col gap-4 items-center py-8">
      <Button className="min-w-48" onClick={handleSelectClick}>
        <Upload className="w-6 h-6" />
        Select Image
      </Button>
      <input
        type="file"
        id="file"
        ref={fileUploadRef}
        onChange={handleFileSelect}
        accept="image/*"
        hidden
      />
      <p className="text-sm text-gray-600 text-center">
        Select an image to crop and upload. Maximum size: 8MB
      </p>
    </div>
  );
};

export default ImageUpload;
