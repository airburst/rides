import { NativeSelect } from "@/components/ui/native-select";
import { memo } from "react";

type WeekSelectorProps = {
  defaultBysetpos?: number;
  defaultByweekday?: number;
  register: any;
};

export const WeekSelector = memo(
  ({ defaultBysetpos, defaultByweekday, register }: WeekSelectorProps) => {
    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="w-full">
          <label htmlFor="bysetpos">Week</label>
          <NativeSelect
            id="bysetpos"
            defaultValue={defaultBysetpos ?? 1}
            {...register("bysetpos")}
          >
            <option value="1">1st</option>
            <option value="2">2nd</option>
            <option value="3">3rd</option>
            <option value="4">4th</option>
            <option value="-1">Last</option>
          </NativeSelect>
        </div>

        <div className="col-span-2 w-full">
          <label htmlFor="byweekday-month">Day of week</label>
          <NativeSelect
            id="byweekday-month"
            aria-label="Repeating schedule freqency"
            defaultValue={defaultByweekday}
            {...register("byweekday")}
          >
            <option value="0">Monday</option>
            <option value="1">Tuesday</option>
            <option value="2">Wednesday</option>
            <option value="3">Thursday</option>
            <option value="4">Friday</option>
            <option value="5">Saturday</option>
            <option value="6">Sunday</option>
          </NativeSelect>
        </div>
      </div>
    );
  },
);

WeekSelector.displayName = "WeekSelector";
