"use client";
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from "react";
import { type FieldErrors, type UseFormRegister, type UseFormSetValue, type UseFormWatch } from "react-hook-form";
import {
  getDay,
  getNow,
  rruleDay,
  rruleDaysInMonth,
} from "../../../shared/utils";
import { type RideFormSchema } from "./formSchemas";

const today = getNow().split("T")[0] ?? "";

type RepeatingRideFormProps = {
  isRepeating?: boolean;
  defaultValues: RideFormSchema;
  repeats: boolean;
  register: UseFormRegister<RideFormSchema>;
  setValue: UseFormSetValue<RideFormSchema>;
  watch: UseFormWatch<RideFormSchema>;
  errors: FieldErrors<RideFormSchema>;
};

export const RepeatingRideForm = ({
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
  const date = watchDate ?? defaultValues?.rideDate;
  const monthDay = defaultValues?.bymonthday ?? getDay(date);
  const dayOfWeek = defaultValues?.byweekday ?? rruleDay(date);
  const watchTime = watch("time");
  const time = defaultValues?.winterStartTime ?? watchTime ?? defaultValues?.time;
  const watchFreq = watch("freq");
  const freq = watchFreq ? +watchFreq : defaultValues?.freq;
  const watchMonth = watch("freq");
  const month = watchMonth ? +watchMonth : defaultValues?.bymonth;
  const minEndDate =
    (watchDate ?? "") > (watchStartDate ?? "") ? watchDate : watchStartDate;
  const defaultEndDate = (defaultValues?.endDate ?? "").split("T")[0];

  // Change startDate when form changes
  useEffect(() => {
    setValue("startDate", date);
  }, [date, setValue]);
  // Change repeating day-of-month when form changes
  useEffect(() => {
    setValue("bymonthday", monthDay);
  }, [monthDay, setValue]);
  // Change day-of-week when form changes
  useEffect(() => {
    setValue("byweekday", dayOfWeek);
  }, [dayOfWeek, setValue]);
  // Change winter time when form changes
  useEffect(() => {
    setValue("winterStartTime", time);
  }, [time, setValue]);

  // Unset irrelevant fields for monthly cadence
  useEffect(() => {
    if (monthType === "byweek") {
      // Unset week values
      setValue("bymonthday", undefined);
    } else {
      // Unset week values
      setValue("bysetpos", undefined);
      setValue("byweekday", undefined);
    }
  }, [monthType, setValue]);

  // Repeating rule chosen frequency
  const isYearly = freq === 0;
  const isMonthly = freq === 1;
  const isWeekly = freq === 2;
  const daysArray = Array.from(Array(rruleDaysInMonth(month ?? 1)).keys()).map(
    (n) => n + 1
  );

  if (isEditMode || !repeats) {
    return <div />;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="form-control w-full">
          <label htmlFor="interval">Every</label>
          <select
            id="interval"
            className="select select-bordered text-lg font-normal"
            defaultValue={defaultValues?.interval}
            {...register("interval")}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>

        <div className="col-span-2 md:col-span-1 form-control w-full">
          <label htmlFor="freq">Frequency</label>
          <select
            id="freq"
            aria-label="Repeating schedule freqency"
            className="select select-bordered text-lg font-normal"
            defaultValue={defaultValues?.freq}
            {...register("freq")}
          >
            <option value="2">Weeks</option>
            <option value="1">Months</option>
          </select>
        </div>

        {isWeekly && (
          <div className="col-span-3 md:col-span-1 form-control w-full">
            <label htmlFor="byweekday">On</label>
            <select
              id="byweekday"
              aria-label="Repeating schedule freqency"
              className="select select-bordered text-lg font-normal"
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
          <div className="form-control w-full col-span-3 md:col-span-1">
            <label htmlFor="repeat-type">Repeat type</label>
            <select
              id="repeat-type"
              className="select select-bordered text-lg font-normal"
              defaultValue={monthType}
              onChange={(e) => setMonthType(e.target.value)}
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
            <div className="flex">
              <div className="form-control w-full">
                <label htmlFor="bymonthday">Day</label>
                <select
                  id="bymonthday"
                  className="select select-bordered text-lg font-normal"
                  defaultValue={monthDay}
                  {...register("bymonthday")}
                >
                  {daysArray.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {monthType === "byweek" && (
            <div className="grid grid-cols-3 gap-4">
              <div className="form-control w-full">
                <label htmlFor="bysetpos">Week</label>
                <select
                  id="bysetpos"
                  className="select select-bordered text-lg font-normal"
                  defaultValue={defaultValues?.bysetpos ?? 1}
                  {...register("bysetpos")}
                >
                  <option value="1">1st</option>
                  <option value="2">2nd</option>
                  <option value="3">3rd</option>
                  <option value="4">4th</option>
                  <option value="-1">Last</option>
                </select>
              </div>

              <div className="col-span-2 form-control w-full">
                <label htmlFor="byweekday-month">Day of week</label>
                <select
                  id="byweekday-month"
                  aria-label="Repeating schedule freqency"
                  className="select select-bordered text-lg font-normal"
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
            </div>
          )}
        </>
      )}
      {isYearly && <div>TODO</div>}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-4 md:gap-8">
          <label htmlFor="startDate" className="flex flex-col gap-1">
            Start Date *
            <input
              id="startDate"
              type="date"
              min={today}
              className="input input-bordered"
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
              className="input input-bordered"
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
              className="input input-bordered"
              defaultValue={defaultValues?.winterStartTime}
              {...register("winterStartTime")}
            />
          </label>
        </div>
      </div>
    </>
  );
};
