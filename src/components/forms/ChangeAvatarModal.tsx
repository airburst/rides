import { type User } from "@/types";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "../Button";
import ImageUpload from "../ImageUpload";

export type ChangeAvatarModalProps = {
  open: boolean;
  onClose: () => void;
  user: User;
  onSuccess?: (image: string, imageLarge: string) => void;
};

const ChangeAvatarModal = ({ open, onClose, user, onSuccess }: ChangeAvatarModalProps) => {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/30" />
        <div className="fixed inset-0 z-40 flex w-screen items-center justify-center p-4">
          <Dialog.Popup className="motion-preset-slide-up w-full max-w-2xl space-y-4 rounded-md bg-white p-6">
            <Dialog.Title className="text-xl font-semibold">Change Avatar Image</Dialog.Title>
            <Dialog.Description className="text-gray-600">
              Select an image and crop it to your preference.
            </Dialog.Description>
            <div>
              <ImageUpload user={user} onClose={onClose} onSuccess={onSuccess} />
            </div>
          </Dialog.Popup>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ChangeAvatarModal;
