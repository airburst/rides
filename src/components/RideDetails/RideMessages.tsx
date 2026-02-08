"use client";

import { useUpdateNotes } from "@/hooks/useRides";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import dynamic from "next/dynamic";
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
  const updateNotes = useUpdateNotes();

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

  const onSubmit: SubmitHandler<FormValues> = ({ notes }) => {
    if (rideId && userId) {
      updateNotes.mutate({ rideId, userId, notes: notes ?? "" });
    }
    closeHandler();
  };

  return (
    <Dialog open={showNotesForm} onClose={doClose} className="relative z-10">
      {/* Background */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="motion-preset-slide-up max-w-lg space-y-4 rounded-md bg-white p-4">
          <DialogTitle className="text-lg">Message</DialogTitle>
          <RideMessagesForm
            defaultValues={defaultValues}
            errors={errors}
            isDirty={isDirty}
            register={register}
            setValue={setValue}
            handleSubmit={handleSubmit(onSubmit)}
            waiting={updateNotes.isPending}
            closeHandler={closeHandler}
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
};
