import { FormEventHandler } from "react";
import {
  UseFormRegister,
  FieldErrorsImpl,
  UseFormSetValue,
} from "react-hook-form";
import { Button } from "../Button";

export type FormValues = {
  notes?: string;
};

type RideNotesFormProps = {
  defaultValues: FormValues;
  register: UseFormRegister<FormValues>;
  errors: Partial<FieldErrorsImpl<FormValues>>;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  setValue: UseFormSetValue<FormValues>;
  isDirty: boolean;
  waiting: boolean;
  closeHandler?: () => void;
};

// Define the form
export const RideNotesForm = ({
  defaultValues,
  register,
  handleSubmit,
  setValue,
  waiting,
  isDirty,
  closeHandler,
}: RideNotesFormProps) => {
  const clearForm = () => {
    setValue("notes", "");
  };

  return (
    <form
      className="relative grid w-full grid-cols-1 gap-4"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4 md:gap-8">
        <label htmlFor="notes" className="flex flex-col">
          <textarea
            id="notes"
            aria-label="ride note"
            className="rounded"
            rows={4}
            defaultValue={defaultValues.notes}
            {...register("notes")}
          />
        </label>
      </div>

      <div className="grid w-full grid-cols-3 grid-rows-[48px] gap-4 md:gap-8">
        <Button primary loading={waiting} disabled={!isDirty} type="submit">
          <div>Add</div>
        </Button>
        <Button accent onClick={clearForm} type="submit">
          <div>Clear</div>
        </Button>
        <Button disabled={waiting} onClick={closeHandler}>
          <span>Cancel</span>
        </Button>
      </div>
    </form>
  );
};
