"use client";

import { updateRideNotes } from "@/server/actions/updateRideNote";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { RideNotesForm, type FormValues } from "./RideNotesForm";

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
    <Dialog open={showNotesForm} onClose={closeHandler} className="relative z-10">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
          <DialogTitle className="font-bold">Add Message</DialogTitle>
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
        </DialogPanel>
      </div>
    </Dialog>
  );
};
