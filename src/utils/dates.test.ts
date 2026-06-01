import { beforeAll, describe, expect, it } from "bun:test";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import {
  formatDate,
  formatFormDate,
  formatTime,
  getFormRideDateAndTime,
  getQueryDateRange,
  isWinter,
  normalizeApiDate,
} from "./dates";

describe("formatDate", () => {
  beforeAll(() => {
    dayjs.extend(utc);
  });

  it("formats a date string correctly", () => {
    const date = "2025-03-30T09:30:00.000Z";
    const result = formatDate(date);

    expect(result).toBe("Sunday 30 March 2025");
  });

  it("formats a summertime offset date string correctly", () => {
    const date = "2025-04-01T09:30:00.000Z";
    const result = formatDate(date);

    expect(result).toBe("Tuesday 01 April 2025");
  });
});

describe("normalizeApiDate", () => {
  it("normalizes postgres timestamptz strings", () => {
    const date = "2026-02-27 09:30:00+00";

    expect(normalizeApiDate(date)).toBe("2026-02-27T09:30:00Z");
  });

  it("does not alter ISO date strings", () => {
    const date = "2026-02-27T09:30:00.000Z";

    expect(normalizeApiDate(date)).toBe(date);
  });
});

describe("form date/time helpers", () => {
  const isoDate = "2026-02-27T09:30:00.000Z";
  const postgresDate = "2026-02-27 09:30:00+00";

  it("formats time from ISO dates", () => {
    expect(formatTime(isoDate)).toBe("09:30");
  });

  it("formats time from postgres timestamptz dates", () => {
    expect(formatTime(postgresDate)).toBe("09:30");
  });

  it("formats form date from ISO dates", () => {
    expect(formatFormDate(isoDate)).toBe("2026-02-27");
  });

  it("formats form date from postgres timestamptz dates", () => {
    expect(formatFormDate(postgresDate)).toBe("2026-02-27");
  });

  it("gets form ride date and time from postgres timestamptz", () => {
    expect(getFormRideDateAndTime(postgresDate)).toEqual({
      rideDate: "2026-02-27",
      startDate: "2026-02-27",
      time: "09:30",
    });
  });

  it("returns empty values when date is missing", () => {
    expect(getFormRideDateAndTime(undefined)).toEqual({
      rideDate: "",
      startDate: "",
      time: "",
    });
  });
});

describe("getQueryDateRange", () => {
  beforeAll(() => {
    dayjs.extend(utc);
  });

  // Regression: in BST (UTC+1), dayjs(date-only).utc() pushed start back a day,
  // so /rides/2026-06-12 also returned 2026-06-11 rides.
  it("keeps the date stable across TZ when given a date-only string in summer", () => {
    const { start, end } = getQueryDateRange({
      start: "2026-06-12",
      end: "2026-06-12",
    });

    expect(start.split("T")[0]).toBe("2026-06-12");
    expect(end.split("T")[0]).toBe("2026-06-12");
  });

  it("keeps the date stable across TZ when given a date-only string in winter", () => {
    const { start, end } = getQueryDateRange({
      start: "2026-12-12",
      end: "2026-12-12",
    });

    expect(start.split("T")[0]).toBe("2026-12-12");
    expect(end.split("T")[0]).toBe("2026-12-12");
  });
});

describe("isWinter", () => {
  it("returns false for October", () => {
    expect(isWinter("2023-10-15T10:00:00.000Z")).toBe(false);
  });

  it("returns true for November", () => {
    expect(isWinter("2023-11-15T10:00:00.000Z")).toBe(true);
  });

  it("returns true for December", () => {
    expect(isWinter("2023-12-15T10:00:00.000Z")).toBe(true);
  });

  it("returns true for January", () => {
    expect(isWinter("2023-01-15T10:00:00.000Z")).toBe(true);
  });

  it("returns true for February", () => {
    expect(isWinter("2023-02-15T10:00:00.000Z")).toBe(true);
  });

  it("returns false for March", () => {
    expect(isWinter("2023-03-15T10:00:00.000Z")).toBe(false);
  });

  it("returns false for July", () => {
    expect(isWinter("2023-07-15T10:00:00.000Z")).toBe(false);
  });
});
