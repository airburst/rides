import { normalizeApiDate } from "@utils/dates";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

const utcDate = (date?: string) => {
  const inputDate = date ? normalizeApiDate(date) : undefined;
  const delta = dayjs(inputDate).utcOffset();

  return dayjs(inputDate).utc().add(delta, "minutes");
};

export const formatCalendarDate = (date: string) =>
  utcDate(date).format("MMMM YYYY");

export const getMonth = () => dayjs().month();

export const getLastMonth = (date?: string) =>
  utcDate(date)
    .subtract(1, "month")
    .set("date", 1)
    .set("hours", 0)
    .set("minutes", 0)
    .set("seconds", 0)
    .set("milliseconds", 0)
    .toISOString();

export const getNextMonth = (date?: string) =>
  utcDate(date)
    .add(1, "month")
    .set("date", 1)
    .set("hours", 0)
    .set("minutes", 0)
    .set("seconds", 0)
    .set("milliseconds", 0)
    .toISOString();

export const firstDayOfMonth = (date?: string) =>
  date ? dayjs(date).startOf("month").day() : dayjs().startOf("month").day();

export const daysInMonth = (date?: string) =>
  date ? dayjs(date).daysInMonth() : dayjs().daysInMonth();

export const getDateStub = (date: string) => {
  const parts = date.split("-");
  return `${parts[0]}-${parts[1]}`;
};

export const getMonthDateRange = (date: string) => {
  const year = dayjs(date).year();
  const month = dayjs(date).month() + 1;
  const formattedMonth = month.toString().padStart(2, "0");
  let start = `${year}-${formattedMonth}-01`;
  let end = `${year}-${formattedMonth}-${dayjs(date).daysInMonth()}`;

  const startDay = firstDayOfMonth(date);
  const lastDay = daysInMonth(date);

  if (startDay > 0) {
    const lastMonth = getLastMonth(date);
    const endOfLastMonth = daysInMonth(lastMonth);
    const day = endOfLastMonth - startDay + 1;

    start = `${getDateStub(lastMonth)}-${day.toString().padStart(2, "0")}`;
  }

  const remainder = (startDay + lastDay) % 7;

  if (remainder > 0) {
    const nextMonth = getNextMonth(date);
    const endDays = 7 - remainder;

    end = `${getDateStub(nextMonth)}-${endDays.toString().padStart(2, "0")}`;
  }

  return { start, end };
};
