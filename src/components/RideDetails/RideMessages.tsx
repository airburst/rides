import { useUpdateNotes } from "@/hooks/useRides";
import { Dialog } from "@base-ui/react/dialog";
import { useForm, type SubmitHandler } from "react-hook-form";
import RideMessagesForm, { type FormValues } from "../forms/RideMessagesForm";

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

  const onSubmit: SubmitHandler<FormValues> = ({ notes }) => {
    if (rideId && userId) {
      updateNotes.mutate({ rideId, userId, notes: notes ?? "" });
    }
    closeHandler();
  };

  return (
    <Dialog.Root open={showNotesForm}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm fill-mode-forwards data-[open]:animate-in data-[open]:fade-in data-[open]:duration-300 data-[closed]:animate-out data-[closed]:fade-out data-[closed]:duration-200" />
        <div className="fixed inset-0 z-40 flex w-screen items-center justify-center p-4">
          <Dialog.Popup className="fill-mode-forwards max-w-lg space-y-4 rounded-md bg-white p-4 data-[open]:animate-in data-[open]:slide-in-from-bottom data-[open]:fade-in data-[open]:duration-300 data-[closed]:animate-out data-[closed]:slide-out-to-bottom data-[closed]:fade-out data-[closed]:duration-200">
            <Dialog.Title className="text-lg">Message</Dialog.Title>
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
          </Dialog.Popup>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
