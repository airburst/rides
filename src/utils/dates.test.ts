import { describe, it, expect, beforeAll } from "bun:test";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { formatDate, isWinter } from "./dates";

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
