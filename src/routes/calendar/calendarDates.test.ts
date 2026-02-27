import { describe, expect, it } from "bun:test";
import dayjs from "dayjs";
import {
  formatCalendarDate,
  getDateStub,
  getLastMonth,
  getMonthDateRange,
  getNextMonth,
} from "./calendarDates";

describe("calendarDates", () => {
  it("formats calendar month labels", () => {
    expect(formatCalendarDate("2026-02-27T09:30:00.000Z")).toBe(
      "February 2026",
    );
  });

  it("calculates previous and next month boundaries", () => {
    expect(
      getLastMonth("2026-03-15T10:00:00.000Z").startsWith("2026-02-01"),
    ).toBe(true);
    expect(
      getNextMonth("2026-03-15T10:00:00.000Z").startsWith("2026-04-01"),
    ).toBe(true);
  });

  it("extracts year-month stub", () => {
    expect(getDateStub("2026-02-01T00:00:00.000Z")).toBe("2026-02");
  });

  it("returns month grid date range covering full calendar view", () => {
    const date = "2026-02-15T00:00:00.000Z";
    const range = getMonthDateRange(date);
    const firstOfMonth = dayjs(date).startOf("month").format("YYYY-MM-DD");
    const lastOfMonth = dayjs(date).endOf("month").format("YYYY-MM-DD");

    expect(range.start <= firstOfMonth).toBe(true);
    expect(range.end >= lastOfMonth).toBe(true);
  });
});
