"use client";

import { updateRideNotes } from "@/server/actions/updateRideNote";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { RideNotesForm, type FormValues } from "../forms/RideNotesForm";

type Props = {
  rideId?: string;
  userId?: string;
  rideNotes?: string;
  showNotesForm: boolean;
  closeHandler: () => void;
};

export const RideNotes = ({
  rideId,
  userId,
  rideNotes,
  showNotesForm,
  closeHandler,
}: Props) => {
  const [waiting, setWaiting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>();

  // Initial state for form: set name, leader and time
  const defaultValues = { notes: rideNotes };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit: SubmitHandler<FormValues> = async ({ notes }) => {
    if (rideId && userId) {
      setWaiting(true);
      await updateRideNotes(rideId, userId, notes ?? "");
      setWaiting(false);
    };
    closeHandler();
  };

  return (
    <Transition appear show={showNotesForm} as={Fragment}>
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
                  Add Message
                </Dialog.Title>

                <div className="mt-2">
                  <div className="w-full text-neutral-800">
                    <RideNotesForm
                      defaultValues={defaultValues}
                      errors={errors}
                      isDirty={isDirty}
                      register={register}
                      setValue={setValue}
                      handleSubmit={handleSubmit(onSubmit)}
                      waiting={waiting}
                      closeHandler={closeHandler}
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
