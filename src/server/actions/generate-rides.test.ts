import { generateRides } from "./generate-rides";
import { db } from "../db";
import { repeatingRides, rides } from "../db/schema";
import { TemplateRide } from "../../types";

// Mock the database
jest.mock("../db", () => ({
  db: {
    transaction: jest.fn(),
    update: jest.fn(),
    query: {
      rides: {
        findMany: jest.fn(),
      },
    },
  },
}));

// Mock the schema
jest.mock("../db/schema", () => ({
  rides: {
    scheduleId: "scheduleId",
    deleted: "deleted",
  },
  repeatingRides: {
    id: "id",
  },
}));

// Mock drizzle-orm functions
jest.mock("drizzle-orm", () => ({
  and: jest.fn((...args) => ({ type: "and", args })),
  eq: jest.fn((field, value) => ({ type: "eq", field, value })),
}));

const mockDb = db;

describe("generateRides", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTemplateRides: TemplateRide[] = [
    {
      name: "Test Ride 1",
      rideDate: "2023-07-15T10:00:00.000Z",
      date: "2023-07-15T10:00:00.000Z",
      scheduleId: "schedule-1",
      distance: 50,
      destination: "Test Location 1",
      createdAt: "2023-07-15T10:00:00.000Z",
    },
    {
      name: "Test Ride 2",
      rideDate: "2023-07-22T10:00:00.000Z",
      date: "2023-07-22T10:00:00.000Z",
      scheduleId: "schedule-1",
      distance: 75,
      destination: "Test Location 2",
      createdAt: "2023-07-15T10:00:00.000Z",
    },
  ];

  const mockSchedule =
    "DTSTART:20230715T100000Z\nRRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=SA";

  describe("successful ride generation", () => {
    it("should create new rides and update schedule", async () => {
      const mockTransaction = jest.fn();
      const mockInsert = jest.fn();
      const mockUpdate = jest.fn();
      const mockValues = jest.fn();
      const mockReturning = jest.fn();
      const mockSet = jest.fn();
      const mockWhere = jest.fn();

      // Setup chain for insert
      mockReturning.mockResolvedValue([
        { rideId: "ride-1" },
        { rideId: "ride-2" },
      ]);
      mockValues.mockReturnValue({ returning: mockReturning });
      mockInsert.mockReturnValue({ values: mockValues });

      // Setup chain for update
      mockWhere.mockResolvedValue(undefined);
      mockSet.mockReturnValue({ where: mockWhere });
      mockUpdate.mockReturnValue({ set: mockSet });

      // Setup transaction mock
      const mockTx = {
        query: {
          rides: {
            findMany: jest.fn().mockResolvedValue([]), // No existing rides
          },
        },
        insert: mockInsert,
        update: mockUpdate,
      };

      mockTransaction.mockImplementation(async (callback) => {
        return await callback(mockTx);
      });

      mockDb.transaction = mockTransaction;

      const result = await generateRides(
        mockTemplateRides,
        "schedule-1",
        mockSchedule,
      );

      expect(result).toEqual({
        success: true,
        createdRides: 2,
        message: "Generated 2 new rides",
      });

      expect(mockTransaction).toHaveBeenCalledTimes(1);
      expect(mockTx.query.rides.findMany).toHaveBeenCalledWith({
        columns: { rideDate: true },
        where: expect.any(Object),
      });
      expect(mockInsert).toHaveBeenCalledWith(rides);
      expect(mockValues).toHaveBeenCalledWith(mockTemplateRides);
      expect(mockUpdate).toHaveBeenCalledWith(repeatingRides);
      expect(mockSet).toHaveBeenCalledWith({ schedule: mockSchedule });
    });
  });

  describe("empty data handling", () => {
    it("should handle empty data array and only update schedule", async () => {
      const mockUpdate = jest.fn();
      const mockSet = jest.fn();
      const mockWhere = jest.fn();

      mockWhere.mockResolvedValue(undefined);
      mockSet.mockReturnValue({ where: mockWhere });
      mockUpdate.mockReturnValue({ set: mockSet });

      mockDb.update = mockUpdate;

      const result = await generateRides([], "schedule-1", mockSchedule);

      expect(result).toEqual({
        success: true,
        createdRides: 0,
        message: "No new rides to generate",
      });

      expect(mockDb.transaction).not.toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalledWith(repeatingRides);
      expect(mockSet).toHaveBeenCalledWith({ schedule: mockSchedule });
    });
  });

  describe("duplicate prevention", () => {
    it("should filter out existing rides and only create new ones", async () => {
      const mockTransaction = jest.fn();
      const mockInsert = jest.fn();
      const mockUpdate = jest.fn();
      const mockValues = jest.fn();
      const mockReturning = jest.fn();
      const mockSet = jest.fn();
      const mockWhere = jest.fn();

      // Setup existing rides (one duplicate)
      const existingRides = [
        { rideDate: "2023-07-15T10:00:00.000Z" }, // Duplicate of first ride
      ];

      // Setup chain for insert (only one new ride)
      mockReturning.mockResolvedValue([{ rideId: "ride-2" }]);
      mockValues.mockReturnValue({ returning: mockReturning });
      mockInsert.mockReturnValue({ values: mockValues });

      // Setup chain for update
      mockWhere.mockResolvedValue(undefined);
      mockSet.mockReturnValue({ where: mockWhere });
      mockUpdate.mockReturnValue({ set: mockSet });

      // Setup transaction mock
      const mockTx = {
        query: {
          rides: {
            findMany: jest.fn().mockResolvedValue(existingRides),
          },
        },
        insert: mockInsert,
        update: mockUpdate,
      };

      mockTransaction.mockImplementation(async (callback) => {
        return await callback(mockTx);
      });

      mockDb.transaction = mockTransaction;

      const result = await generateRides(
        mockTemplateRides,
        "schedule-1",
        mockSchedule,
      );

      expect(result).toEqual({
        success: true,
        createdRides: 1,
        message: "Generated 1 new rides",
      });

      // Should only insert the second ride (not the duplicate)
      expect(mockValues).toHaveBeenCalledWith([mockTemplateRides[1]!]);
    });

    it("should handle case where all rides already exist", async () => {
      const mockTransaction = jest.fn();
      const mockUpdate = jest.fn();
      const mockSet = jest.fn();
      const mockWhere = jest.fn();

      // All rides already exist
      const existingRides = [
        { rideDate: "2023-07-15T10:00:00.000Z" },
        { rideDate: "2023-07-22T10:00:00.000Z" },
      ];

      // Setup chain for update
      mockWhere.mockResolvedValue(undefined);
      mockSet.mockReturnValue({ where: mockWhere });
      mockUpdate.mockReturnValue({ set: mockSet });

      // Setup transaction mock
      const mockTx = {
        query: {
          rides: {
            findMany: jest.fn().mockResolvedValue(existingRides),
          },
        },
        insert: jest.fn(), // Should not be called
        update: mockUpdate,
      };

      mockTransaction.mockImplementation(async (callback) => {
        return await callback(mockTx);
      });

      mockDb.transaction = mockTransaction;

      const result = await generateRides(
        mockTemplateRides,
        "schedule-1",
        mockSchedule,
      );

      expect(result).toEqual({
        success: true,
        createdRides: 0,
        message: "No new rides needed",
      });

      // Insert should not be called since no new rides
      expect(mockTx.insert).not.toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalledWith(repeatingRides);
    });
  });

  describe("error handling", () => {
    it("should handle database transaction errors", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      const mockTransaction = jest.fn();

      mockTransaction.mockRejectedValue(
        new Error("Database connection failed"),
      );
      mockDb.transaction = mockTransaction;

      const result = await generateRides(
        mockTemplateRides,
        "schedule-1",
        mockSchedule,
      );

      expect(result).toEqual({
        success: false,
        message: "Unable to generate rides",
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "💢 generate-rides",
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it("should handle errors in empty data case", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      const mockUpdate = jest.fn();
      const mockSet = jest.fn();
      const mockWhere = jest.fn();

      // Setup mock to throw error
      mockWhere.mockRejectedValue(new Error("Update failed"));
      mockSet.mockReturnValue({ where: mockWhere });
      mockUpdate.mockReturnValue({ set: mockSet });
      mockDb.update = mockUpdate;

      const result = await generateRides([], "schedule-1", mockSchedule);

      expect(result).toEqual({
        success: false,
        message: "Unable to generate rides",
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "💢 generate-rides",
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe("schedule update", () => {
    it("should update repeating ride schedule with correct parameters", async () => {
      const mockTransaction = jest.fn();
      const mockInsert = jest.fn();
      const mockUpdate = jest.fn();
      const mockValues = jest.fn();
      const mockReturning = jest.fn();
      const mockSet = jest.fn();
      const mockWhere = jest.fn();

      // Setup chains
      mockReturning.mockResolvedValue([{ rideId: "ride-1" }]);
      mockValues.mockReturnValue({ returning: mockReturning });
      mockInsert.mockReturnValue({ values: mockValues });

      mockWhere.mockResolvedValue(undefined);
      mockSet.mockReturnValue({ where: mockWhere });
      mockUpdate.mockReturnValue({ set: mockSet });

      const mockTx = {
        query: {
          rides: {
            findMany: jest.fn().mockResolvedValue([]),
          },
        },
        insert: mockInsert,
        update: mockUpdate,
      };

      mockTransaction.mockImplementation(async (callback) => {
        return await callback(mockTx);
      });

      mockDb.transaction = mockTransaction;

      const customSchedule =
        "DTSTART:20230801T100000Z\nRRULE:FREQ=WEEKLY;BYDAY=SU";
      const scheduleId = "custom-schedule-123";

      await generateRides([mockTemplateRides[0]!], scheduleId, customSchedule);

      expect(mockSet).toHaveBeenCalledWith({ schedule: customSchedule });
      expect(mockWhere).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "eq",
          field: "id",
          value: scheduleId,
        }),
      );
    });
  });
});
