"use client";

import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
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

  // Only close the dialog if the value is truthy
  const doClose = (value?: unknown) => {
    if (value) {
      closeHandler();
    }
  };

  return (
    <Dialog open={open} onClose={doClose} className="relative z-10">
      {/* Background */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-4 rounded-md bg-white p-8">
          <DialogTitle>{heading}</DialogTitle>
          <Description>{children}</Description>
          <div className="mt-4 flex h-10 flex-row gap-4">
            <Button
              data-autofocus
              className="min-w-24"
              primary
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
        </DialogPanel>
      </div>
    </Dialog>
  );
};
