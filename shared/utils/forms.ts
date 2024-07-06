import { type RideFormSchema } from "@/components/forms/formSchemas";
import { type RepeatingRide, type RideFormValues } from "src/types";
import { makeUtcDate } from "./dates";

export const flattenArrayNumber = (
  value?: number[] | number | null,
): number | undefined => {
  if (!value) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : value;
};

export const makeRide = (formData: RideFormValues) => {
  const {
    name,
    rideDate,
    time,
    rideGroup,
    meetPoint,
    destination,
    distance,
    leader,
    route,
    notes,
    rideLimit,
    freq,
  } = formData;
  const utcDate = makeUtcDate(rideDate, time);

  return {
    name,
    rideDate: utcDate,
    rideGroup,
    destination,
    distance: +distance,
    leader,
    route,
    meetPoint,
    notes,
    rideLimit: +(rideLimit ?? -1),
    freq: +(freq ?? 2),
  };
};

export const makeRepeatingRide = (formData: RideFormSchema): RepeatingRide => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rideDate, // Remove from object
    time,
    distance: distanceString,
    startDate,
    bymonthday,
    bysetpos,
    byweekday,
    freq: freqString,
    ...data
  } = formData;
  // Cast string form values to numbers / date
  const freq = +freqString;
  const distance = +distanceString;
  const weekday = byweekday ?? 5;
  const weekno = bysetpos ?? 1;
  const monthday = bymonthday ?? 1;
  // Concatenate time onto startDate, to ensure that all generated rides are correct
  const startDateWithTime = makeUtcDate(startDate!, time);

  let payload: RepeatingRide = {
    freq,
    distance,
    startDate: startDateWithTime,
    ...data,
  };
  // Remove unwanted keys
  // Weekly - remove all monthly and annual values
  if (freq === 2) {
    payload = { ...payload, byweekday: +weekday };
  }
  // Monthly
  if (freq === 1) {
    if (bymonthday) {
      payload = { ...payload, bymonthday: +monthday };
    } else {
      payload = { ...payload, bysetpos: +weekno, byweekday: +weekday };
    }
  }

  // Convert to RRule
  return payload;
};
