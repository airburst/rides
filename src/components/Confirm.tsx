import { Dialog } from "@base-ui/react/dialog";
import { useState, type JSX } from "react";
import { Button } from "./Button";

type Props = {
  open: boolean;
  heading?: string;
  children?: JSX.Element;
  okLabel?: string;
  cancelLabel?: string;
  closeHandler: () => void;
  onYes?: (cb: (flag: boolean) => void) => void;
};

export const Confirm = ({
  open,
  heading = "Are you sure?",
  children,
  okLabel = "YES",
  cancelLabel = "NO",
  closeHandler,
  onYes,
}: Props) => {
  const [waiting, setWaiting] = useState<boolean>(false);

  const confirmHandler = () => {
    if (onYes) {
      setWaiting(true);
      onYes(() => setWaiting(false));
    }
  };

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm fill-mode-forwards data-[open]:animate-in data-[open]:fade-in data-[open]:duration-300 data-[closed]:animate-out data-[closed]:fade-out data-[closed]:duration-200" />
        <div className="fixed inset-0 z-40 flex w-screen items-center justify-center p-4">
          <Dialog.Popup className="fill-mode-forwards max-w-lg space-y-4 rounded-md bg-white p-4 text-lg data-[open]:animate-in data-[open]:slide-in-from-bottom data-[open]:fade-in data-[open]:duration-300 data-[closed]:animate-out data-[closed]:slide-out-to-bottom data-[closed]:fade-out data-[closed]:duration-200">
            <Dialog.Title>{heading}</Dialog.Title>
            <Dialog.Description>{children}</Dialog.Description>
            <div className="mt-4 flex flex-row gap-4">
              <Button
                data-autofocus
                className="min-w-24"
                error
                onClick={confirmHandler}
                loading={waiting}
              >
                <span>{okLabel}</span>
              </Button>
              <Button
                className="min-w-24"
                onClick={closeHandler}
                disabled={waiting}
              >
                <span>{cancelLabel}</span>
              </Button>
            </div>
          </Dialog.Popup>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
