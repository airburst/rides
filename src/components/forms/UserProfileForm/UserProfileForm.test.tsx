import { describe, expect, it, mock, beforeEach, afterEach } from "bun:test";
import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import type { User } from "../../../types";

// --- Mocks ---
const mockUpdateMutate = mock(() => {});
const mockRouterBack = mock(() => {});

mock.module("@/hooks/users", () => ({
  useUpdateUser: () => ({
    mutate: mockUpdateMutate,
    isPending: false,
  }),
  useUploadAvatar: () => ({ mutate: mock(() => {}), isPending: false }),
  useUser: () => ({ data: null }),
  useUsers: () => ({ data: [] }),
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

// Mock ChangeAvatarModal — uses dialog APIs
mock.module("../ChangeAvatarModal", () => ({
  default: () => null,
}));

import { renderWithProviders } from "@/test-utils";
import UserProfileForm from "./index";

const mockUser: User = {
  id: "user-123",
  name: "Jane Smith",
  email: "jane@example.com",
  mobile: "07700 900123",
  emergency: "John Smith 07700 900456",
  role: "USER",
  preferences: { units: "km" },
  image: "https://example.com/avatar.jpg",
  membershipId: "M001",
  membershipStatus: "MEMBER",
};

beforeEach(() => {
  mockUpdateMutate.mockClear();
  mockRouterBack.mockClear();
});

afterEach(cleanup);

describe("UserProfileForm", () => {
  it("renders with user data", () => {
    renderWithProviders(<UserProfileForm user={mockUser} />);

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    const mobileInput = screen.getByLabelText(/mobile/i) as HTMLInputElement;
    const emergInput = screen.getByLabelText(
      /emergency contact/i,
    ) as HTMLInputElement;

    expect(nameInput.value).toBe("Jane Smith");
    expect(mobileInput.value).toBe("07700 900123");
    expect(emergInput.value).toBe("John Smith 07700 900456");
  });

  it("calls updateMutation on submit with correct payload", async () => {
    renderWithProviders(<UserProfileForm user={mockUser} />);

    // Change name to trigger isDirty
    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "Jane Updated" } });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockUpdateMutate).toHaveBeenCalledTimes(1);
    });

    const args = mockUpdateMutate.mock.calls[0]?.[0] as {
      id: string;
      data: Record<string, unknown>;
    };
    expect(args.id).toBe("user-123");
    expect(args.data.name).toBe("Jane Updated");
    expect(args.data.mobile).toBe("07700 900123");
    expect(args.data.emergency).toBe("John Smith 07700 900456");
    // Non-admin users should not send role or membership fields
    expect(args.data.role).toBeUndefined();
    expect(args.data.membershipId).toBeUndefined();
    expect(args.data.membershipStatus).toBeUndefined();
  });

  it("shows validation error for empty name", async () => {
    renderWithProviders(<UserProfileForm user={mockUser} />);

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/name must contain at least 3 letters/i),
      ).toBeTruthy();
    });

    expect(mockUpdateMutate).not.toHaveBeenCalled();
  });

  it("shows validation error for invalid emergency contact", async () => {
    renderWithProviders(<UserProfileForm user={mockUser} />);

    const emergInput = screen.getByLabelText(
      /emergency contact/i,
    ) as HTMLInputElement;
    fireEvent.change(emergInput, { target: { value: "No phone here!!!" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/emergency contact must include a telephone number/i),
      ).toBeTruthy();
    });

    expect(mockUpdateMutate).not.toHaveBeenCalled();
  });
});
