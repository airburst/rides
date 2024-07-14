"use client";
import { type User } from "@/types";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Button } from "../Button";
import ImageUpload from "../ImageUpload";

export type ChangeAvatarModalProps = {
  open: boolean;
  onClose: () => void;
  user: User;
}

const ChangeAvatarModal = ({ open, onClose, user }: ChangeAvatarModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      {/* Background */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-4 rounded-md bg-white p-8">
          <DialogTitle className="text-xl">Change Avatar Image</DialogTitle>
          <Description>Upload or take a picture of your choice, no larger than 4mb.</Description>
          <div><ImageUpload user={user} onClose={onClose} /></div>
          <div className="mt-4 flex h-10 flex-row gap-4">
            <Button
              className="min-w-24"
              onClick={onClose}
            >
              <span>CANCEL</span>
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default ChangeAvatarModal;