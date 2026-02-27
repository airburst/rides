import { describe, it, expect, beforeEach, mock } from "bun:test";
import pkg from "rrule";
const { RRule } = pkg;
import type { RepeatingRide, RepeatingRideDb } from "@/types";

const mockIsWinter = mock(() => false);

mock.module("./dates", () => {
  const actual = require("./dates");
  return { ...actual, isWinter: mockIsWinter };
});

const { isWinter } = await import("./dates");
const {
  changeToWinterTime,
  convertToRRule,
  generateRide,
  getNextOccurrence,
  makeRidesInPeriod,
  repeatingRideFromDb,
  repeatingRideToDb,
  updateRRuleStartDate,
} = await import("./repeatingRides");

describe("repeatingRides", () => {
  describe("convertToRRule", () => {
    it("should convert repeating ride to RRule string", async () => {
      const data: RepeatingRide = {
        name: "Test Ride",
        freq: RRule.WEEKLY,
        interval: 1,
        startDate: "2023-01-01T10:00:00.000Z",
        endDate: "2023-12-31T10:00:00.000Z",
        byweekday: [0, 2], // Monday and Wednesday
      };

      const result = await convertToRRule(data);

      expect(result).toContain("FREQ=WEEKLY");
      expect(result).toContain("INTERVAL=1");
      expect(result).toContain("DTSTART:20230101T100000Z");
      expect(result).toContain("UNTIL=20231231T100000Z");
      expect(result).toContain("BYDAY=MO,WE");
    });
  });

  describe("updateRRuleStartDate", () => {
    it("should update the start date in an RRule string", async () => {
      const schedule =
        "FREQ=WEEKLY;DTSTART=20230101T100000Z;INTERVAL=1;BYDAY=MO,WE";
      const newStartDate = "2023-02-01T10:00:00.000Z";

      const result = await updateRRuleStartDate(schedule, newStartDate);
      expect(result).toContain("DTSTART:20230201T100000Z");
    });

    it("should return original schedule if no startDate provided", async () => {
      const schedule =
        "FREQ=WEEKLY;DTSTART=20230101T100000Z;INTERVAL=1;BYDAY=MO,WE";

      const result = await updateRRuleStartDate(schedule);
      expect(result).toBe(schedule);
    });
  });

  describe("repeatingRideToDb", () => {
    it("should convert a repeating ride to database format", async () => {
      const ride: RepeatingRide = {
        id: "1",
        name: "Test Ride",
        freq: RRule.WEEKLY,
        interval: 1,
        startDate: "2023-01-01T10:00:00.000Z",
        endDate: "2023-12-31T10:00:00.000Z",
        byweekday: [0, 2],
      };

      const result = await repeatingRideToDb(ride);
      expect(result).toHaveProperty("schedule");
      expect(result).toHaveProperty("id", "1");
      expect(result).toHaveProperty("name", "Test Ride");
      expect(result.schedule).toContain("FREQ=WEEKLY");
    });
  });

  describe("repeatingRideFromDb", () => {
    it("should convert a database ride to repeating ride format", async () => {
      const dbRide: RepeatingRideDb = {
        id: "1",
        name: "Test Ride",
        schedule:
          "FREQ=WEEKLY;DTSTART=20230101T100000Z;UNTIL=20231231T100000Z;INTERVAL=1;BYDAY=MO,WE",
      };

      const result = await repeatingRideFromDb(dbRide);
      expect(result).toHaveProperty("freq", RRule.WEEKLY);
      expect(result).toHaveProperty("interval", 1);
      expect(result).toHaveProperty("startDate", "2023-01-01T10:00:00.000Z");
      expect(result).toHaveProperty("endDate", "2023-12-31T10:00:00.000Z");
      expect(result).toHaveProperty("byweekday");
      expect(result).toHaveProperty("textRule");
    });

    it("should parse monthly by day schedule", async () => {
      const dbRide: RepeatingRideDb = {
        id: "monthly-1",
        name: "Monthly Day Ride",
        schedule:
          "DTSTART:20230115T100000Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=15",
      };

      const result = await repeatingRideFromDb(dbRide);
      expect(result.freq).toBe(RRule.MONTHLY);
      expect(result.bymonthday).toBe(15);
    });

    it("should parse monthly by week position schedule", async () => {
      const dbRide: RepeatingRideDb = {
        id: "monthly-2",
        name: "Monthly Position Ride",
        schedule:
          "DTSTART:20230107T100000Z\nRRULE:FREQ=MONTHLY;BYDAY=SA;BYSETPOS=1",
      };

      const result = await repeatingRideFromDb(dbRide);
      expect(result.freq).toBe(RRule.MONTHLY);
      expect(result.bysetpos).toBe(1);
      expect(result.byweekday).toBe(5); // SA = 5
    });
  });

  describe("changeToWinterTime", () => {
    beforeEach(() => {
      mockIsWinter.mockReset();
    });

    it("should change time if date is in winter", () => {
      mockIsWinter.mockReturnValue(true);
      const dateTime = new Date("2023-01-15T10:00:00.000Z");
      const winterStartTime = "09:30";

      const result = changeToWinterTime(dateTime, winterStartTime);
      expect(result).toBe("2023-01-15T09:30:00.000Z");
    });

    it("should not change time if date is not in winter", () => {
      mockIsWinter.mockReturnValue(false);
      const dateTime = new Date("2023-06-15T10:00:00.000Z");
      const winterStartTime = "09:30";

      const result = changeToWinterTime(dateTime, winterStartTime);
      expect(result).toBe("2023-06-15T10:00:00.000Z");
    });
  });

  describe("generateRide", () => {
    it("should generate a ride from a template and date", () => {
      const template: RepeatingRideDb = {
        id: "1",
        name: "Weekly Ride",
        destination: "Mountain",
        rideGroup: "A",
        distance: 50,
        meetPoint: "Park",
        route: "route123",
        leader: "John",
        notes: "Bring water",
        schedule: "FREQ=WEEKLY;DTSTART:20230101T100000Z",
        rideLimit: 10,
      };

      const date = "2023-01-08T10:00:00.000Z";

      const result = generateRide(template, date);
      expect(result).toEqual({
        name: "Weekly Ride",
        rideDate: date,
        destination: "Mountain",
        rideGroup: "A",
        distance: 50,
        meetPoint: "Park",
        route: "route123",
        leader: "John",
        notes: "Bring water",
        rideLimit: 10,
        scheduleId: "1",
      });
    });

    it("should filter out undefined values", () => {
      const template: RepeatingRideDb = {
        id: "1",
        name: "Weekly Ride",
        schedule: "FREQ=WEEKLY;DTSTART:20230101T100000Z",
      };

      const date = "2023-01-08T10:00:00.000Z";

      const result = generateRide(template, date);
      expect(result).toEqual({
        name: "Weekly Ride",
        rideDate: date,
        scheduleId: "1",
      });
    });
  });

  describe("makeRidesInPeriod", () => {
    it("should generate rides for the next month period", async () => {
      const template: RepeatingRideDb = {
        id: "1",
        name: "Weekly Ride",
        schedule:
          "DTSTART:20250515T183000Z\nRRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=TH",
      };

      const result = await makeRidesInPeriod(template, "2025-05-15");

      expect(result).toHaveProperty("id", "1");
      expect(result).toHaveProperty("schedule", template.schedule);
      expect(result.rides).toHaveLength(3); // 3 Thursdays in May 2025
      expect(result.rides).toEqual([
        {
          name: "Weekly Ride",
          rideDate: "2025-05-15T18:30:00.000Z",
          scheduleId: "1",
        },
        {
          name: "Weekly Ride",
          rideDate: "2025-05-22T18:30:00.000Z",
          scheduleId: "1",
        },
        {
          name: "Weekly Ride",
          rideDate: "2025-05-29T18:30:00.000Z",
          scheduleId: "1",
        },
      ]);
    });

    it("should use provided date as start date", async () => {
      const startDate = "2023-03-15T00:00:00.000Z";

      const template: RepeatingRideDb = {
        id: "1",
        name: "Weekly Ride",
        schedule: "DTSTART:20230101T100000Z\nRRULE:FREQ=WEEKLY;BYDAY=SU",
      };

      const result = await makeRidesInPeriod(template, startDate);

      expect(result.rides.length).toBeGreaterThan(0);
    });

    it("should apply winter start times when specified", async () => {
      mockIsWinter.mockReturnValue(true);

      const template: RepeatingRideDb = {
        id: "1",
        name: "Weekly Ride",
        schedule: "DTSTART:20230101T100000Z\nRRULE:FREQ=WEEKLY;BYDAY=SU",
        winterStartTime: "09:30",
      };

      const result = await makeRidesInPeriod(
        template,
        "2023-01-01T00:00:00.000Z",
      );
      expect(result.rides).toHaveLength(5); //5 Sundays in January 2023
      expect(result.rides?.[0]?.rideDate).toContain("09:30:00");
    });

    it("should apply real winter time for November dates", async () => {
      mockIsWinter.mockImplementation((date: string) => {
        const month = new Date(date).getMonth();
        return month >= 10 || month < 2;
      });

      const template: RepeatingRideDb = {
        id: "winter-1",
        name: "Winter Ride",
        schedule:
          "DTSTART:20231105T100000Z\nRRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=SU",
        winterStartTime: "09:00",
      };

      const result = await makeRidesInPeriod(template, "2023-11-05");
      expect(result.rides.length).toBeGreaterThan(0);
      for (const ride of result.rides) {
        expect(ride.rideDate).toContain("09:00:00");
      }
    });
  });

  describe("getNextOccurrence", () => {
    it("weekly ride returns a future date", async () => {
      const ride: RepeatingRide = {
        name: "Weekly Ride",
        freq: RRule.WEEKLY,
        interval: 1,
        startDate: "2020-01-06T10:00:00.000Z",
        byweekday: 0, // Monday
      };

      const result = await getNextOccurrence(ride);
      expect(result).not.toBeNull();
      expect(new Date(result!).getTime()).toBeGreaterThan(Date.now());
    });

    it("ride with until in the past returns null", async () => {
      const ride: RepeatingRide = {
        name: "Past Ride",
        freq: RRule.WEEKLY,
        interval: 1,
        startDate: "2020-01-06T10:00:00.000Z",
        endDate: "2020-12-31T10:00:00.000Z",
        byweekday: 0,
      };

      const result = await getNextOccurrence(ride);
      expect(result).toBeNull();
    });

    it("monthly ride returns correct next occurrence", async () => {
      const ride: RepeatingRide = {
        name: "Monthly Ride",
        freq: RRule.MONTHLY,
        interval: 1,
        startDate: "2020-01-15T10:00:00.000Z",
        bymonthday: 15,
      };

      const result = await getNextOccurrence(ride);
      expect(result).not.toBeNull();
      expect(new Date(result!).getUTCDate()).toBe(15);
    });
  });

  describe("create and generate flow", () => {
    it("form → RRule → rides round-trip", async () => {
      const ride: RepeatingRide = {
        id: "test-1",
        name: "Thursday Ride",
        freq: RRule.WEEKLY,
        interval: 1,
        startDate: "2025-05-01T18:30:00.000Z",
        endDate: "2025-12-31T18:30:00.000Z",
        byweekday: 3, // Thursday
      };

      const dbRide = await repeatingRideToDb(ride);
      expect(dbRide.schedule).toContain("FREQ=WEEKLY");
      expect(dbRide.schedule).toContain("BYDAY=TH");

      const rideSet = await makeRidesInPeriod(dbRide, "2025-05-01");
      expect(rideSet.rides.length).toBeGreaterThan(0);
      expect(rideSet.rides[0]).toHaveProperty("scheduleId", "test-1");

      for (const r of rideSet.rides) {
        const d = new Date(r.rideDate);
        expect(d.getUTCDay()).toBe(4); // Thursday
        expect(d.getUTCHours()).toBe(18);
        expect(d.getUTCMinutes()).toBe(30);
      }
    });

    it("DTSTART doesn't shift on re-save", async () => {
      const ride: RepeatingRide = {
        id: "test-2",
        name: "Sunday Ride",
        freq: RRule.WEEKLY,
        interval: 1,
        startDate: "2025-03-02T09:00:00.000Z",
        endDate: "2025-12-31T09:00:00.000Z",
        byweekday: 6, // Sunday
      };

      const dbRide1 = await repeatingRideToDb(ride);
      const roundTripped = await repeatingRideFromDb(dbRide1);
      const dbRide2 = await repeatingRideToDb(roundTripped);

      expect(dbRide2.schedule).toBe(dbRide1.schedule);
    });

    it("updateRRuleStartDate preserves time", async () => {
      const ride: RepeatingRide = {
        name: "Ride",
        freq: RRule.WEEKLY,
        interval: 1,
        startDate: "2025-01-06T08:30:00.000Z",
        byweekday: 0,
      };

      const dbRide = await repeatingRideToDb(ride);
      const updated = await updateRRuleStartDate(
        dbRide.schedule,
        "2025-03-03T08:30:00.000Z",
      );

      expect(updated).toContain("DTSTART:20250303T083000Z");
    });

    it("makeRidesInPeriod is idempotent", async () => {
      const ride: RepeatingRide = {
        id: "idem-1",
        name: "Saturday Ride",
        freq: RRule.WEEKLY,
        interval: 1,
        startDate: "2025-05-03T08:00:00.000Z",
        endDate: "2025-12-31T08:00:00.000Z",
        byweekday: 5, // Saturday
      };

      const dbRide = await repeatingRideToDb(ride);
      const first = await makeRidesInPeriod(dbRide, "2025-05-03");
      const second = await makeRidesInPeriod(dbRide, "2025-05-03");

      expect(second.rides).toEqual(first.rides);
    });
  });
});
