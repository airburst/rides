import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { getDay, getNow, rruleDay } from "../../../../shared/utils";
import type { RideFormSchema } from "../formSchemas";
import { MonthDaySelector } from "./MonthDaySelector";
import { WeekSelector } from "./WeekSelector";

const today = getNow().split("T")[0] ?? "";

export type RepeatingRideFormProps = {
  isRepeating?: boolean;
  defaultValues: RideFormSchema;
  repeats: boolean;
  register: UseFormRegister<RideFormSchema>;
  setValue: UseFormSetValue<RideFormSchema>;
  watch: UseFormWatch<RideFormSchema>;
  errors: FieldErrors<RideFormSchema>;
};

const RepeatingRideForm = memo(
  ({
    isRepeating,
    defaultValues,
    repeats,
    register,
    setValue,
    watch,
    errors,
  }: RepeatingRideFormProps) => {
    // Calculate byweek or month for copied schedule
    const monthlyCadence = defaultValues?.byweekday ? "byweek" : "byday";
    const [monthType, setMonthType] = useState<string>(monthlyCadence);
    const isEditMode = !!defaultValues?.id && !isRepeating;

    // Get watched values
    const watchDate = watch("rideDate");
    const watchStartDate = watch("startDate");
    const watchTime = watch("time");
    const watchFreq = watch("freq");
    const watchMonth = watch("freq");

    // Derived values - no useEffect needed
    const date = watchDate ?? defaultValues?.rideDate;
    const monthDay = useMemo(
      () => defaultValues?.bymonthday ?? getDay(date),
      [defaultValues?.bymonthday, date],
    );
    const dayOfWeek = useMemo(
      () => defaultValues?.byweekday ?? rruleDay(date),
      [defaultValues?.byweekday, date],
    );
    const time = useMemo(
      () => defaultValues?.winterStartTime ?? watchTime ?? defaultValues?.time,
      [defaultValues?.winterStartTime, defaultValues?.time, watchTime],
    );
    const freq = useMemo(
      () => (watchFreq ? +watchFreq : defaultValues?.freq),
      [watchFreq, defaultValues?.freq],
    );
    const month = useMemo(
      () => (watchMonth ? +watchMonth : defaultValues?.bymonth),
      [watchMonth, defaultValues?.bymonth],
    );

    const minEndDate = useMemo(
      () =>
        (watchDate ?? "") > (watchStartDate ?? "") ? watchDate : watchStartDate,
      [watchDate, watchStartDate],
    );

    const defaultEndDate = useMemo(
      () => (defaultValues?.endDate ?? "").split("T")[0],
      [defaultValues?.endDate],
    );

    // Sync form values when watched values change
    useEffect(() => {
      setValue("startDate", date);
    }, [date, setValue]);

    useEffect(() => {
      setValue("bymonthday", monthDay);
    }, [monthDay, setValue]);

    useEffect(() => {
      setValue("byweekday", dayOfWeek);
    }, [dayOfWeek, setValue]);

    useEffect(() => {
      setValue("winterStartTime", time);
    }, [time, setValue]);

    // Clear conflicting fields when monthType changes
    const handleMonthTypeChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        setMonthType(newType);

        if (newType === "byweek") {
          setValue("bymonthday", undefined);
        } else {
          setValue("bysetpos", undefined);
          setValue("byweekday", undefined);
        }
      },
      [setValue],
    );

    // Repeating rule chosen frequency
    const isYearly = freq === 0;
    const isMonthly = freq === 1;
    const isWeekly = freq === 2;

    if (isEditMode || !repeats) {
      return null;
    }

    return (
      <>
        <div className="grid grid-cols-3 gap-4">
          <div className="w-full">
            <label htmlFor="interval">Every</label>
            <select
              id="interval"
              className="select w-full text-lg font-normal"
              defaultValue={defaultValues?.interval}
              {...register("interval")}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          <div className="col-span-2 w-full md:col-span-1">
            <label htmlFor="freq">Frequency</label>
            <select
              id="freq"
              aria-label="Repeating schedule freqency"
              className="select w-full text-lg font-normal"
              defaultValue={defaultValues?.freq}
              {...register("freq")}
            >
              <option value="2">Weeks</option>
              <option value="1">Months</option>
            </select>
          </div>

          {isWeekly && (
            <div className="col-span-3 w-full md:col-span-1">
              <label htmlFor="byweekday">On</label>
              <select
                id="byweekday"
                aria-label="Repeating schedule freqency"
                className="select w-full text-lg font-normal"
                defaultValue={defaultValues?.byweekday}
                {...register("byweekday")}
              >
                <option value="0">Monday</option>
                <option value="1">Tuesday</option>
                <option value="2">Wednesday</option>
                <option value="3">Thursday</option>
                <option value="4">Friday</option>
                <option value="5">Saturday</option>
                <option value="6">Sunday</option>
              </select>
            </div>
          )}

          {isMonthly && (
            <div className="col-span-3 w-full md:col-span-1">
              <label htmlFor="repeat-type">Repeat type</label>
              <select
                id="repeat-type"
                className="select w-full text-lg font-normal"
                value={monthType}
                onChange={handleMonthTypeChange}
              >
                <option value="byday">On the same day each month</option>
                <option value="byweek">On specific day and week</option>
              </select>
            </div>
          )}
        </div>

        {isMonthly && (
          <>
            {monthType === "byday" && (
              <MonthDaySelector
                monthDay={monthDay}
                month={month}
                register={register}
              />
            )}
            {monthType === "byweek" && (
              <WeekSelector
                defaultBysetpos={defaultValues?.bysetpos}
                defaultByweekday={defaultValues?.byweekday}
                register={register}
              />
            )}
          </>
        )}
        {isYearly && <div>TODO</div>}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-4 md:gap-8">
            <label htmlFor="startDate" className="flex flex-col gap-1">
              Start Date *
              <input
                id="startDate"
                type="date"
                min={today}
                className="input w-full"
                defaultValue={date}
                {...register("startDate", {
                  required: true,
                })}
              />
              {errors.startDate && (
                <span className="font-normal text-red-500">
                  Start date is required
                </span>
              )}
            </label>
          </div>
          <div className="flex flex-col gap-4 md:gap-8">
            <label htmlFor="endDate" className="flex flex-col gap-1">
              End Date (optional)
              <input
                id="endDate"
                type="date"
                defaultValue={defaultEndDate}
                min={minEndDate}
                className="input w-full"
                {...register("endDate")}
              />
            </label>
          </div>

          <div className="flex flex-col gap-4 md:gap-8">
            <label htmlFor="winterStartTime" className="flex flex-col gap-1">
              Winter Start
              <input
                id="winterStartTime"
                type="time"
                className="input w-full"
                defaultValue={defaultValues?.winterStartTime}
                {...register("winterStartTime")}
              />
            </label>
          </div>
        </div>
      </>
    );
  },
);

RepeatingRideForm.displayName = "RepeatingRideForm";

export default RepeatingRideForm;
