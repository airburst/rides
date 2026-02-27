import { beforeEach, describe, expect, it, mock } from "bun:test";
import { formatFormDate, getNow } from "../../utils/dates";

const mockUseSession = mock(() => ({
  session: { user: { role: "ADMIN" } },
  isLoading: false,
}));

const mockUseRepeatingRide = mock(() => ({
  data: null as unknown,
  isLoading: false,
  error: null,
}));

mock.module("@/hooks/useSession", () => ({
  useSession: mockUseSession,
}));

mock.module("./useRepeatingRide", () => ({
  useRepeatingRide: mockUseRepeatingRide,
}));

const { useRepeatingRideFormDefaults } =
  await import("./useRepeatingRideFormDefaults");

describe("useRepeatingRideFormDefaults", () => {
  beforeEach(() => {
    mockUseSession.mockReset();
    mockUseRepeatingRide.mockReset();

    mockUseSession.mockReturnValue({
      session: { user: { role: "ADMIN" } },
      isLoading: false,
    });

    mockUseRepeatingRide.mockReturnValue({
      data: {
        id: "rr-1",
        name: "Weekly Club Ride",
        freq: 2,
        startDate: "2026-02-27 09:30:00+00",
        endDate: "2026-05-01 09:30:00+00",
        winterStartTime: "08:45",
        rideGroup: "B",
        destination: "Hills",
        meetPoint: "Cafe",
        notes: "Steady pace",
        leader: "Chris",
        route: "https://example.com/route",
        distance: 55,
        rideLimit: 20,
        byweekday: [5],
        bysetpos: [1],
        bymonthday: [27],
      },
      isLoading: false,
      error: null,
    });
  });

  it("returns edit defaults with id and winter start time", () => {
    const result = useRepeatingRideFormDefaults("rr-1", "edit");

    expect(result.isLeaderOrAdmin).toBe(true);
    expect(result.defaultValues).toMatchObject({
      id: "rr-1",
      rideDate: "2026-02-27",
      startDate: "2026-02-27",
      time: "09:30",
      winterStartTime: "08:45",
    });
  });

  it("returns copy defaults without id and sets today ride date", () => {
    const expectedToday = formatFormDate(getNow());
    const result = useRepeatingRideFormDefaults("rr-1", "copy");

    expect(result.defaultValues?.id).toBeUndefined();
    expect(result.defaultValues?.rideDate).toBe(expectedToday);
    expect(result.defaultValues?.winterStartTime).toBe("09:30");
  });

  it("returns unauthorised status for non-leader users", () => {
    mockUseSession.mockReturnValue({
      session: { user: { role: "MEMBER" } },
      isLoading: false,
    });

    const result = useRepeatingRideFormDefaults("rr-1", "edit");

    expect(result.isLeaderOrAdmin).toBe(false);
    expect(result.isAdmin).toBe(false);
  });
});
