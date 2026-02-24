import { Dialog } from "@base-ui/react/dialog";
import { useState, type JSX } from "react";
import { Button } from "./Button";

type Props = {
  open: boolean;
  heading?: string;
  description?: string;
  children?: JSX.Element;
  okLabel?: string;
  cancelLabel?: string;
  closeHandler: () => void;
  onYes?: (cb: (flag: boolean) => void) => void;
};

export const ConfirmWithContent = ({
  open,
  heading = "Are you sure?",
  description,
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
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/30" />
        <div className="fixed inset-0 z-40 flex w-screen items-center justify-center p-4">
          <Dialog.Popup className="motion-preset-slide-up max-w-lg space-y-4 rounded-md bg-white p-4 text-lg">
            <Dialog.Title>{heading}</Dialog.Title>
            {description && (
              <Dialog.Description>{description}</Dialog.Description>
            )}
            {children}
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
