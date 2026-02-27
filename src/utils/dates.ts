import { FOREVER } from "@/constants";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

/** Normalize postgres timestamptz string to ISO 8601 */
export const normalizeApiDate = (date: string): string =>
  date.replace(" ", "T").replace(/\+00$/, "Z");

// Current UTC time
export const getNow = () => {
  return dayjs().utc().toISOString();
};

// Determine whether a ride can be joined yet
// Allow join and leave up to 12 hours after ride starts
const JOIN_DELAY = 0; // 0 hours

export const isJoinable = (date: string, time?: string): boolean => {
  const isoDate = makeUtcDate(date, time ?? "00:00");
  const latestChange = dayjs(isoDate).add(JOIN_DELAY, "hour").toISOString();

  return getNow() < latestChange;
};

export const getDateFromString = (dateString: string, _end?: boolean) => {
  return dayjs(dateString).utc().toISOString();
};

// Set ISO time in db; no offset calculation
export const makeUtcDate = (day: string, time: string): string =>
  dayjs(`${day}T${time}:00.000Z`).utc().format();

export const getNextWeek = () => {
  const nextWeek = dayjs().add(7, "day").toISOString();

  return nextWeek;
};

export const getNextNWeeks = (weeks: string) => {
  const delta = dayjs().utcOffset();

  if (weeks === "-1") {
    return dayjs(FOREVER).toISOString();
  }
  const inNWeeks = dayjs()
    .add(+weeks * 7, "day")
    .add(delta, "minutes")
    .toISOString();

  return inNWeeks;
};

export const getNextTwoWeeks = () => getNextNWeeks("2");

// Get next Day of Week
export const findNextDay = (day = 6, startInDays = 0) => {
  const today = dayjs().day();

  let delta = day - today;
  if (delta <= 0) {
    delta += 7;
  }

  delta += startInDays;
  return dayjs().add(delta, "day").toISOString();
};

export const getQueryDateRange = ({
  start,
  end,
}: {
  start?: string;
  end?: string;
}): { start: string; end: string } => {
  const now = getNow();

  const st = start ? getDateFromString(start) : now;
  let en = end ? getDateFromString(end, true) : FOREVER;

  // Set end of day on en
  en = dayjs(en)
    .set("hour", 23)
    .set("minute", 59)
    .set("second", 59)
    .toISOString();

  return { start: st, end: en };
};

export const isSaturday = (date: string) => dayjs(date).day() === 6;

export const formatDate = (date: string) => {
  return dayjs(normalizeApiDate(date)).utc().format("dddd DD MMMM YYYY");
};

export const formatDateShort = (date: string) => {
  return dayjs(normalizeApiDate(date)).utc().format("dddd DD MMMM");
};

export const getDay = (date?: string): number => +(dayjs(date).date() || 1);

export const formatTime = (date: string) =>
  dayjs(normalizeApiDate(date)).utc().format("HH:mm");

export const formatFormDate = (date: string = getNow()) => {
  return dayjs(normalizeApiDate(date)).utc().format("YYYY-MM-DD");
};

export const getRideDateAndTime = (date: string) => ({
  day: formatDateShort(date),
  time: formatTime(date),
});

// Formatted for form inputs:
// date = "yyyy-mm-dd" and time = "hh:mm"
export const getFormRideDateAndTime = (
  rideDate?: string,
  fixedDate?: string,
) => {
  const date = fixedDate ?? rideDate;

  if (!date) {
    return {
      rideDate: "",
      startDate: "",
      time: "",
    };
  }

  const normalizedDate = normalizeApiDate(date);

  return {
    rideDate: formatFormDate(normalizedDate),
    startDate: formatFormDate(normalizedDate),
    time: formatTime(normalizedDate),
  };
};

// Winter is 01 Nov - end Feb
export const isWinter = (date: string): boolean => {
  const month = dayjs(date).month();

  return month >= 10 || month < 2;
};

export const getDateInWeeks = (weeks: string): string => {
  const weeksNumber = parseInt(weeks, 10);

  // Check for 'forever' code (-1) and return long future date
  if (weeksNumber === -1) {
    return FOREVER;
  }

  const nextWeek = dayjs().add(weeksNumber, "week").toISOString();

  return nextWeek.split("T")[0]!;
};

export const sqlDate = (date: string) => date.replace("T", " ").slice(0, 16);

// Get day of week (integer) in RRule format
// Monday = 0, instead of Sunday
export const rruleDay = (date?: string) => {
  const day = date ? new Date(date).getDay() - 1 : new Date().getDay() - 1;

  return day < 0 ? 7 + day : day;
};

export const rruleDaysInMonth = (month: number) => {
  const mm = month.toString().padStart(2, "0");
  const date = `2023-${mm}-01T00:00:00.000Z`;

  return dayjs(date).daysInMonth();
};
