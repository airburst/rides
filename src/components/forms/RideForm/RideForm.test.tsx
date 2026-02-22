import { describe, expect, it, mock, beforeEach, afterEach } from "bun:test";
import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import type { RideFormSchema } from "../formSchemas";

// --- Mocks ---
const mockCreateMutate = mock(() => {});
const mockUpdateMutate = mock(() => {});
const mockRouterBack = mock(() => {});

mock.module("@/hooks/useRides", () => ({
  useCreateRide: () => ({
    mutate: mockCreateMutate,
    isPending: false,
  }),
  useUpdateRide: () => ({
    mutate: mockUpdateMutate,
    isPending: false,
  }),
}));

mock.module("@/hooks/repeating-rides", () => ({
  useCreateRepeatingRide: () => ({ mutate: mock(() => {}), isPending: false }),
  useUpdateRepeatingRide: () => ({ mutate: mock(() => {}), isPending: false }),
  useGenerateRides: () => ({ mutate: mock(() => {}), isPending: false }),
}));

mock.module("@tanstack/react-router", () => ({
  useRouter: () => ({
    history: { back: mockRouterBack },
    navigate: mock(() => {}),
  }),
}));

mock.module("sonner", () => ({
  toast: {
    success: mock(() => {}),
    error: mock(() => {}),
  },
}));

// Mock the markdown editor — it uses DOM APIs not available in test
mock.module("../../Markdown/Editor", () => ({
  default: ({ onChange }: { onChange?: (v: string) => void }) => (
    <textarea
      data-testid="mock-editor"
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}));

import { renderWithProviders } from "@/test-utils";
import RideForm from "./index";

const defaultValues: RideFormSchema = {
  name: "Sunday Ride",
  rideDate: "2025-03-15",
  time: "08:30",
  distance: 50,
  rideGroup: "Fast",
  destination: "Bath",
  meetPoint: "Brunel Square",
  notes: "",
  leader: "Mark",
  route: "https://ridewithgps.com/123",
  rideLimit: -1,
  freq: 0,
};

beforeEach(() => {
  mockCreateMutate.mockClear();
  mockUpdateMutate.mockClear();
  mockRouterBack.mockClear();
});

afterEach(cleanup);

describe("RideForm", () => {
  it("renders with default values", () => {
    renderWithProviders(<RideForm defaultValues={defaultValues} />);

    const nameInput = screen.getByLabelText(/ride name/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/^date/i) as HTMLInputElement;
    const timeInput = screen.getByLabelText(/start time/i) as HTMLInputElement;
    const distInput = screen.getByLabelText(/distance/i) as HTMLInputElement;

    expect(nameInput.value).toBe("Sunday Ride");
    expect(dateInput.value).toBe("2025-03-15");
    expect(timeInput.value).toBe("08:30");
    expect(distInput.value).toBe("50");
  });

  it("calls createMutation on submit for new ride", async () => {
    renderWithProviders(<RideForm defaultValues={defaultValues} />);

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockCreateMutate).toHaveBeenCalledTimes(1);
    });

    const payload = mockCreateMutate.mock.calls[0]?.[0] as Record<
      string,
      unknown
    >;
    expect(payload.name).toBe("Sunday Ride");
    expect(payload.distance).toBe(50);
    expect(payload.rideGroup).toBe("Fast");
  });

  it("calls updateMutation when id is present", async () => {
    const withId: RideFormSchema = { ...defaultValues, id: "ride-123" };
    renderWithProviders(<RideForm defaultValues={withId} />);

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockUpdateMutate).toHaveBeenCalledTimes(1);
    });

    const args = mockUpdateMutate.mock.calls[0]?.[0] as {
      id: string;
      data: Record<string, unknown>;
    };
    expect(args.id).toBe("ride-123");
    expect(args.data.name).toBe("Sunday Ride");
  });

  it("shows validation error for empty name and does not call mutate", async () => {
    renderWithProviders(
      <RideForm defaultValues={{ ...defaultValues, name: "" }} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/ride name is required/i)).toBeTruthy();
    });

    expect(mockCreateMutate).not.toHaveBeenCalled();
  });

  it("shows validation error for distance < 10", async () => {
    renderWithProviders(
      <RideForm defaultValues={{ ...defaultValues, distance: 5 }} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/ride must be at least 10km/i)).toBeTruthy();
    });

    expect(mockCreateMutate).not.toHaveBeenCalled();
  });
});
