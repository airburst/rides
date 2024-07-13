"use client";

import { updateAvatar } from '@/server/actions/update-avatar';
import { type User } from '@/types';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { type MouseEvent, useRef, useState } from 'react';
import { Button } from './Button';

export type ImageUploadProps = {
  user: User;
  onClose: () => void;
}

const ImageUpload = ({ user, onClose }: ImageUploadProps) => {
  const [avatarURL, setAvatarURL] = useState(user.image!);

  const fileUploadRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    fileUploadRef?.current?.click();
  }

  const uploadImageDisplay = async () => {
    try {
      if (fileUploadRef?.current?.files) {
        const uploadedFile = fileUploadRef.current.files[0];

        const reader = new FileReader();

        reader.onloadend = async () => {
          setAvatarURL(reader.result as string);
          await updateAvatar(user.id, reader.result as string);
          onClose();
        }
        reader.readAsDataURL(uploadedFile!);
      }
    } catch (error) {
      console.error(error);
      setAvatarURL(user.image!);
    }
  }

  return (
    <div className="flex flex-row gap-8">
      <div className="avatar">
        <div className="w-[40px] rounded-full">
          <Image className="text-neutral-500" src={avatarURL} width={40} height={40} alt="Avatar" />
        </div>
      </div>

      <form id="form" encType='multipart/form-data'>
        <Button accent
          type='submit'
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