/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { formatDate } from "./dates";

describe("formatDate", () => {
  beforeAll(() => {
    dayjs.extend(utc);
  });

  it("formats a date string correctly", () => {
    const date = "2025-03-30T09:30:00.000Z";
    const result = formatDate(date);
    const delta = dayjs(date).utcOffset();

    expect(delta).toBe(60);

    expect(result).toBe("Sunday 30 March");
  });

  it("formats a summertime offset date string correctly", () => {
    const date = "2025-04-01T09:30:00.000Z";
    const result = formatDate(date);
    const delta = dayjs(date).utcOffset();

    expect(delta).toBe(60);
    expect(result).toBe("Tuesday 01 April");
  });
});
