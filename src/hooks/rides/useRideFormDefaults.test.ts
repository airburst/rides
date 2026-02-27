import { beforeEach, describe, expect, it, mock } from "bun:test";

const mockUseSession = mock(() => ({
  session: { user: { role: "ADMIN" } },
}));

const mockUseRide = mock(() => ({
  data: null as unknown,
  isLoading: false,
  error: null,
}));

mock.module("@/hooks/useSession", () => ({
  useSession: mockUseSession,
}));

mock.module("./useRide", () => ({
  useRide: mockUseRide,
}));

const { useRideFormDefaults } = await import("./useRideFormDefaults");

describe("useRideFormDefaults", () => {
  beforeEach(() => {
    mockUseSession.mockReset();
    mockUseRide.mockReset();

    mockUseSession.mockReturnValue({
      session: { user: { role: "ADMIN" } },
    });

    mockUseRide.mockReturnValue({
      data: {
        id: "ride-1",
        name: "Club Ride",
        rideDate: "2026-02-27 09:30:00+00",
        rideGroup: "A",
        destination: "Bath",
        meetPoint: "Station",
        distance: 70,
        leader: "Alice",
        route: "https://example.com",
        notes: "Bring lights",
        rideLimit: 25,
      },
      isLoading: false,
      error: null,
    });
  });

  it("returns edit defaults with normalized date and time", () => {
    const result = useRideFormDefaults("ride-1", "edit");

    expect(result.isLeaderOrAdmin).toBe(true);
    expect(result.isAdmin).toBe(true);
    expect(result.defaultValues).toMatchObject({
      id: "ride-1",
      rideDate: "2026-02-27",
      time: "09:30",
      name: "Club Ride",
    });
  });

  it("returns copy defaults without id", () => {
    const result = useRideFormDefaults("ride-1", "copy");

    expect(result.defaultValues?.id).toBeUndefined();
    expect(result.defaultValues?.rideDate).toBe("2026-02-27");
    expect(result.defaultValues?.time).toBe("09:30");
  });

  it("returns unauthorised status for non-leader users", () => {
    mockUseSession.mockReturnValue({
      session: { user: { role: "MEMBER" } },
    });

    const result = useRideFormDefaults("ride-1", "edit");

    expect(result.isLeaderOrAdmin).toBe(false);
    expect(result.isAdmin).toBe(false);
  });
});
