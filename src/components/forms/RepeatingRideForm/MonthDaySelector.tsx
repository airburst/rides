import { NativeSelect } from "@/components/ui/native-select";
import { memo, useMemo } from "react";

type MonthDaySelectorProps = {
  monthDay: number;
  month?: number;
  register: any;
};

export const MonthDaySelector = memo(
  ({ monthDay, month, register }: MonthDaySelectorProps) => {
    const daysArray = useMemo(() => {
      const daysInMonth = month ? new Date(2000, month, 0).getDate() : 31;
      return Array.from(Array(daysInMonth).keys()).map((n) => n + 1);
    }, [month]);

    return (
      <div className="flex">
        <div className="w-full">
          <label htmlFor="bymonthday">Day</label>
          <NativeSelect
            id="bymonthday"
            defaultValue={monthDay}
            {...register("bymonthday")}
          >
            {daysArray.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>
    );
  },
);

MonthDaySelector.displayName = "MonthDaySelector";
