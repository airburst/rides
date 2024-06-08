import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
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
  okLabel = "Yes",
  cancelLabel = "No",
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
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeHandler}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {heading}
                </Dialog.Title>

                <div className="mt-2">{children}</div>

                <div className="mt-4 flex h-10 flex-row gap-4">
                  <Button primary onClick={confirmHandler} loading={waiting}>
                    <span>{okLabel}</span>
                  </Button>
                  <Button onClick={closeHandler} disabled={waiting}>
                    <span>{cancelLabel}</span>
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
