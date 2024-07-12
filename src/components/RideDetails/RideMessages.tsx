"use client";

import { updateMessage } from "@/server/actions/update-message";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { type FormValues } from "../forms/RideMessagesForm";

const RideMessagesForm = dynamic(() => import("../forms/RideMessagesForm"));

type Props = {
  rideId?: string;
  userId?: string;
  messages?: string;
  showNotesForm: boolean;
  closeHandler: () => void;
};

export const RideMessages = ({
  rideId,
  userId,
  messages,
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
  const defaultValues = { notes: messages };

  // Only close the dialog if the value is truthy
  const doClose = (value?: unknown) => {
    if (value) {
      closeHandler();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit: SubmitHandler<FormValues> = async ({ notes }) => {
    if (rideId && userId) {
      setWaiting(true);
      await updateMessage(rideId, userId, notes ?? "");
      setWaiting(false);
    };
    closeHandler();
  };

  return (
    <Dialog open={showNotesForm} onClose={doClose} className="relative z-10">
      {/* Background */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-4 rounded-md bg-white p-8">
          <DialogTitle className="text-lg">Message</DialogTitle>
          <RideMessagesForm
            defaultValues={defaultValues}
            errors={errors}
            isDirty={isDirty}
            register={register}
            setValue={setValue}
            handleSubmit={handleSubmit(onSubmit)}
            waiting={waiting}
            closeHandler={closeHandler}
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
};
