import { ToggleSwitch } from "@/components/ToggleSwitch";
import { lazy, memo } from "react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { RideFormSchema } from "../formSchemas";

const RepeatingRideForm = lazy(() => import("../RepeatingRideForm"));

type RepeatingSectionProps = {
  showRepeatingSwitch: boolean;
  repeats: boolean;
  handleRepeatsChange: () => void;
  defaultValues: RideFormSchema;
  register: UseFormRegister<RideFormSchema>;
  errors: FieldErrors<RideFormSchema>;
  watch: UseFormWatch<RideFormSchema>;
  setValue: UseFormSetValue<RideFormSchema>;
  isRepeating?: boolean;
};

export const RepeatingSection = memo(
  ({
    showRepeatingSwitch,
    repeats,
    handleRepeatsChange,
    defaultValues,
    register,
    errors,
    watch,
    setValue,
    isRepeating,
  }: RepeatingSectionProps) => {
    if (!showRepeatingSwitch) {
      return null;
    }

    return (
      <>
        <div className="flex flex-row items-center">
          <div className="pr-8">This ride repeats</div>
          <ToggleSwitch
            checked={repeats}
            onCheckedChange={handleRepeatsChange}
            label="Toggle repeating"
          />
        </div>
        <RepeatingRideForm
          defaultValues={defaultValues}
          register={register}
          errors={errors}
          repeats={repeats}
          watch={watch}
          setValue={setValue}
          isRepeating={isRepeating}
        />
      </>
    );
  },
);

RepeatingSection.displayName = "RepeatingSection";
