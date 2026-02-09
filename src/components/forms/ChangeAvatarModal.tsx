import { type User } from "@/types";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "../Button";
import ImageUpload from "../ImageUpload";

export type ChangeAvatarModalProps = {
  open: boolean;
  onClose: () => void;
  user: User;
};

const ChangeAvatarModal = ({ open, onClose, user }: ChangeAvatarModalProps) => {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-10 bg-black/30" />
        <div className="fixed inset-0 z-10 flex w-screen items-center justify-center p-4">
          <Dialog.Popup className="motion-preset-slide-up max-w-lg space-y-4 rounded-md bg-white p-4">
            <Dialog.Title className="text-xl">
              Change Avatar Image
            </Dialog.Title>
            <Dialog.Description>
              Upload or take a picture of your choice, no larger than 4mb.
            </Dialog.Description>
            <div>
              <ImageUpload user={user} onClose={onClose} />
            </div>
            <div className="mt-4 flex flex-row gap-4">
              <Button className="min-w-24" onClick={onClose}>
                <span>CANCEL</span>
              </Button>
            </div>
          </Dialog.Popup>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ChangeAvatarModal;
