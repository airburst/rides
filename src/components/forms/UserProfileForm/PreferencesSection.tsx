import { Button } from "@/components/Button";
import { CancelButton } from "@/components/Button/CancelButton";
import { NativeSelect } from "@/components/ui/native-select";
import { memo } from "react";
import type { UseFormRegister } from "react-hook-form";
import type { UserProfileFormSchema } from "../formSchemas";

type PreferencesSectionProps = {
  defaultUnits?: string;
  register: UseFormRegister<UserProfileFormSchema>;
  isPending: boolean;
  isDirty: boolean;
};

export const PreferencesSection = memo(
  ({ defaultUnits, register, isPending, isDirty }: PreferencesSectionProps) => {
    return (
      <>
        <div className="bg-primary mt-4 flex w-screen flex-row items-center justify-center p-2 font-bold tracking-wide text-white uppercase sm:rounded md:mx-0 md:w-full">
          Preferences
        </div>
        <div className="grid grid-cols-1 gap-4 p-2">
          <div className="grid grid-cols-1 gap-4 md:gap-8">
            <label className="w-full">
              <div className="mb-1 font-medium">Units</div>
              <NativeSelect
                id="units"
                defaultValue={defaultUnits}
                {...register("preferences.units")}
              >
                <option value="km">Kilometers</option>
                <option value="miles">Miles</option>
              </NativeSelect>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            <Button
              primary
              type="submit"
              loading={isPending}
              disabled={!isDirty}
            >
              SAVE
            </Button>
            <CancelButton />
          </div>
        </div>
      </>
    );
  },
);

PreferencesSection.displayName = "PreferencesSection";
