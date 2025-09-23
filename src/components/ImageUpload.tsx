"use client";

import { MAX_FILE_SIZE_IN_BYTES } from '@/constants';
import { updateAvatar } from '@/server/actions/update-avatar';
import { type User } from '@/types';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { type MouseEvent, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './Button';

export type ImageUploadProps = {
  user: User;
  onClose: () => void;
}

const ImageUpload = ({ user, onClose }: ImageUploadProps) => {
  const [avatarURL, setAvatarURL] = useState(user.image!);
  const [isUploading, setIsUploading] = useState(false);

  const fileUploadRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    fileUploadRef?.current?.click();
  }

  const uploadImageDisplay = async () => {
    try {
      if (fileUploadRef?.current?.files) {
        const uploadedFile = fileUploadRef.current.files[0];

        if (uploadedFile?.size && uploadedFile?.size > MAX_FILE_SIZE_IN_BYTES) {
          toast.error("File size too large");
          return;
        }

        const reader = new FileReader();

        reader.onloadend = async () => {
          setAvatarURL(reader.result as string);
          await updateAvatar(user.id, reader.result as string);
          toast.success("Changed profile image");
          setIsUploading(false);
          onClose();
        }

        setIsUploading(true);
        reader.readAsDataURL(uploadedFile!);
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to upload image");
      setIsUploading(false);
      setAvatarURL(user.image!);
    }
  }

  return (
    <div className="flex flex-row gap-8 items-center">
      <div className="avatar">
        <div className="w-[40px] h-[40px] rounded-full">
          <Image className="text-neutral-500" src={avatarURL} width={40} height={40} alt="Avatar" />
        </div>
      </div>

      <form id="form" encType='multipart/form-data'>
        <Button accent
          className="min-w-32"
          type="submit"
          disabled={isUploading}
          loading={isUploading}
          onClick={handleImageUpload}>
          <Upload className="w-6 h-6" />
          UPLOAD
        </Button>
        <input
          type="file"
          id="file"
          ref={fileUploadRef}
          onChange={uploadImageDisplay}
          hidden />
      </form>
    </div>
  )
}

export default ImageUpload