/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  type RepeatingRide,
  type RepeatingRideDb,
  type TemplateRide,
} from "@/types";
import { getNextMonth, isWinter } from "./dates";
import { getScalarValue } from "./general";

const loadRRule = async () => {
  const pkg = await import("rrule");
  // Handle both ESM and CJS module formats
  return pkg.RRule || pkg.default?.RRule || pkg.default;
};

export const convertToRRule = async (data: RepeatingRide): Promise<string> => {
  const {
    freq,
    interval = 1,
    startDate,
    endDate,
    byweekday,
    bysetpos,
    bymonth,
    bymonthday,
  } = data;

  const dtstart = new Date(startDate);
  const until = endDate ? new Date(endDate) : undefined;

  const RRule = await loadRRule();
  const rrule = new RRule({
    freq,
    interval,
    byweekday, // 0 == RRule.MO
    bysetpos,
    bymonth,
    bymonthday,
    dtstart,
    until,
  });

  return rrule.toString();
};

export const getNextOccurrence = async (
  data: RepeatingRide,
): Promise<string | null> => {
  const {
    freq,
    interval = 1,
    startDate,
    endDate,
    byweekday,
    bysetpos,
    bymonth,
    bymonthday,
  } = data;

  const dtstart = new Date(startDate);
  const until = endDate ? new Date(endDate) : undefined;

  const RRule = await loadRRule();
  const rrule = new RRule({
    freq,
    interval,
    byweekday,
    bysetpos,
    bymonth,
    bymonthday,
    dtstart,
    until,
  });

  const next = rrule.after(new Date());
  return next ? next.toISOString() : null;
};

export const updateRRuleStartDate = async (
  schedule: string,
  startDate?: string,
) => {
  if (!startDate) {
    return schedule;
  }

  const RRule = await loadRRule();
  // Convert rrule back into editable variables
  const rrule = RRule.fromString(schedule);
  const {
    freq,
    interval,
    byweekday, // 0 == RRule.MO
    bysetpos,
    bymonth,
    bymonthday,
    until,
  } = rrule.options;
  const dtstart = new Date(startDate.valueOf());

  // Update start date
  const updatedSchedule = new RRule({
    freq,
    dtstart,
    until,
    interval,
    byweekday,
    bysetpos,
    bymonth,
    bymonthday,
  });

  return updatedSchedule.toString();
};

export const repeatingRideToDb = async (
  ride: RepeatingRide,
): Promise<RepeatingRideDb> => {
  const {
    freq,
    interval,
    startDate,
    endDate,
    byweekday,
    bysetpos,
    bymonth,
    bymonthday,
    ...rest
  } = ride;
  const schedule = await convertToRRule(ride);

  return {
    schedule,
    ...rest,
  };
};

export const repeatingRideFromDb = async (
  ride: RepeatingRideDb,
): Promise<RepeatingRide> => {
  const { schedule, ...rest } = ride;
  const RRule = await loadRRule();
  // Convert rrule back into editable variables
  const rrule = RRule.fromString(schedule);
  const textRule = rrule.toText();

  const {
    freq,
    interval,
    dtstart,
    byweekday,
    bysetpos,
    bymonth,
    bymonthday,
    until,
  } = rrule.options;

  return {
    ...rest,
    freq,
    interval,
    startDate: new Date(dtstart).toISOString(),
    endDate: until ? new Date(until).toISOString() : null,
    byweekday: getScalarValue(byweekday),
    bysetpos: getScalarValue(bysetpos),
    bymonth: getScalarValue(bymonth),
    bymonthday: getScalarValue(bymonthday),
    textRule,
  };
};

export const changeToWinterTime = (
  dateTime: Date,
  winterStartTime: string,
): string => {
  const dateString = dateTime.toISOString();

  if (!isWinter(dateString)) {
    return dateString;
  }

  const [hours, minutes] = winterStartTime.split(":");

  if (hours) {
    dateTime.setHours(+hours);
  }
  if (minutes) {
    dateTime.setMinutes(+minutes);
  }

  return dateTime.toISOString();
};

// Generate ride for a given template and date
export const generateRide = (
  {
    id,
    name,
    destination,
    rideGroup,
    distance,
    meetPoint,
    route,
    leader,
    notes,
    rideLimit,
  }: RepeatingRideDb,
  date: string,
) => {
  const ride = {
    name,
    rideDate: date,
    destination,
    rideGroup,
    distance,
    meetPoint,
    route,
    leader,
    notes,
    rideLimit,
    scheduleId: id,
  };

  return Object.fromEntries(
    Object.entries(ride).filter(([, val]) => val),
  ) as unknown as TemplateRide;
};

export type RideSet = {
  id?: string;
  schedule: string;
  rides: TemplateRide[];
};

export const makeRidesInPeriod = async (
  template: RepeatingRideDb,
  date?: string,
): Promise<RideSet> => {
  const { id, schedule } = template;
  const start = date ? new Date(date) : new Date();
  const nextMonth = getNextMonth(date);
  const end = new Date(nextMonth);
  const RRule = await loadRRule();
  const rideDates = RRule.fromString(schedule).between(start, end);

  // Update timings if winterStartTime is set
  const rides =
    typeof template.winterStartTime === "string"
      ? rideDates.map((r) =>
          generateRide(
            template,
            changeToWinterTime(r, template.winterStartTime!),
          ),
        )
      : rideDates.map((r) => generateRide(template, r.toISOString()));

  return {
    id,
    schedule,
    rides,
  };
};
