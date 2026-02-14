import { MAX_FILE_SIZE_IN_BYTES } from "@/constants";
import { useUploadAvatar } from "@/hooks/users";
import { resolveAvatarUrl } from "@/lib/avatar";
import { type User } from "@/types";
import { Upload } from "lucide-react";
import { type MouseEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./Button";

export type ImageUploadProps = {
  user: User;
  onClose: () => void;
  onSuccess?: (image: string, imageLarge: string) => void;
};

const ImageUpload = ({ user, onClose, onSuccess }: ImageUploadProps) => {
  const [avatarURL, setAvatarURL] = useState(resolveAvatarUrl(user.image));
  const uploadMutation = useUploadAvatar();

  const fileUploadRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    fileUploadRef?.current?.click();
  };

  const uploadImageDisplay = async () => {
    try {
      if (!fileUploadRef?.current?.files?.length) {
        return;
      }

      const uploadedFile = fileUploadRef.current.files[0];
      if (!uploadedFile) {
        return;
      }

      if (uploadedFile.size > MAX_FILE_SIZE_IN_BYTES) {
        toast.error("File size too large");
        return;
      }

      // Validate file type
      if (!uploadedFile.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      uploadMutation.mutate(
        { userId: user.id, file: uploadedFile },
        {
          onSuccess: (response: { image: string; imageLarge: string }) => {
            const newAvatarUrl = resolveAvatarUrl(response.image);
            setAvatarURL(newAvatarUrl);
            toast.success("Avatar updated successfully");
            onSuccess?.(response.image, response.imageLarge);
            onClose();
          },
          onError: (error: Error) => {
            console.error("Avatar upload error:", error);
            toast.error("Unable to upload image");
          },
        },
      );
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Unable to upload image");
    }
  };

  return (
    <div className="flex flex-row gap-8 items-center">
      <div className="avatar">
        <div className="w-10 h-10 rounded-full">
          <img
            className="text-neutral-500"
            src={avatarURL}
            width={40}
            height={40}
            alt="Avatar"
          />
        </div>
      </div>

      <form id="form" encType="multipart/form-data">
        <Button
          accent
          className="min-w-32"
          type="submit"
          disabled={uploadMutation.isPending}
          loading={uploadMutation.isPending}
          onClick={handleImageUpload}
        >
          <Upload className="w-6 h-6" />
          UPLOAD
        </Button>
        <input
          type="file"
          id="file"
          ref={fileUploadRef}
          onChange={uploadImageDisplay}
          hidden
        />
      </form>
    </div>
  );
};

export default ImageUpload;
