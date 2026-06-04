import { beforeEach, describe, expect, it, mock } from "bun:test";
import { renderHook, waitFor } from "@testing-library/react";
import { TestWrapper } from "@/test-utils";

const mockApiClient = mock(async (_endpoint: string) => ({ user: null }));

let auth0State: {
  isAuthenticated: boolean;
  isLoading: boolean;
  getAccessTokenSilently: () => Promise<string>;
};

let betterAuthSessionState:
  | {
      session: { id: string; expiresAt: string };
      user: { id: string; name: string; email: string; emailVerified: boolean };
    }
  | null;

const mockUseAuth0 = mock(() => auth0State);
const mockUseBetterAuthSession = mock(() => ({
  data: betterAuthSessionState,
  isLoading: false,
}));

mock.module("@auth0/auth0-react", () => ({
  useAuth0: mockUseAuth0,
}));

mock.module("@/hooks/auth", () => ({
  useBetterAuthSession: mockUseBetterAuthSession,
}));

mock.module("@/lib/api", () => ({
  apiClient: mockApiClient,
}));

const { useUser } = await import("./useUser");
const { useUpdateUser } = await import("./useUpdateUser");

describe("user hooks with dual auth client", () => {
  beforeEach(() => {
    mockApiClient.mockClear();
    mockUseAuth0.mockClear();
    mockUseBetterAuthSession.mockClear();

    auth0State = {
      isAuthenticated: false,
      isLoading: false,
      getAccessTokenSilently: mock(async () => "auth0-token"),
    };

    betterAuthSessionState = null;
  });

  it("useUser uses Auth0 bearer token path", async () => {
    auth0State.isAuthenticated = true;

    mockApiClient.mockImplementationOnce(async () => ({
      user: { id: "u-1", name: "Alice" },
    }));

    const { result } = renderHook(() => useUser("u-1"), {
      wrapper: TestWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockApiClient).toHaveBeenCalledTimes(1);
    expect(mockApiClient.mock.calls[0]?.[0]).toBe("/users/u-1");
    expect(mockApiClient.mock.calls[0]?.[1]).toMatchObject({
      token: "auth0-token",
    });
  });

  it("useUser uses better-auth cookie credentials path", async () => {
    betterAuthSessionState = {
      session: { id: "sess-1", expiresAt: "2099-01-01T00:00:00.000Z" },
      user: {
        id: "u-2",
        name: "Bob",
        email: "bob@example.com",
        emailVerified: true,
      },
    };

    mockApiClient.mockImplementationOnce(async () => ({
      user: { id: "u-2", name: "Bob" },
    }));

    const { result } = renderHook(() => useUser("u-2"), {
      wrapper: TestWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockApiClient).toHaveBeenCalledTimes(1);
    expect(mockApiClient.mock.calls[0]?.[1]).toMatchObject({
      credentials: "include",
    });
  });

  it("useUpdateUser mutation works with better-auth cookie credentials", async () => {
    betterAuthSessionState = {
      session: { id: "sess-1", expiresAt: "2099-01-01T00:00:00.000Z" },
      user: {
        id: "u-3",
        name: "Charlie",
        email: "charlie@example.com",
        emailVerified: true,
      },
    };

    mockApiClient.mockImplementationOnce(async () => ({
      success: true,
      id: "u-3",
    }));

    const { result } = renderHook(() => useUpdateUser(), {
      wrapper: TestWrapper,
    });

    await result.current.mutateAsync({
      id: "u-3",
      data: { name: "Updated" },
    });

    expect(mockApiClient).toHaveBeenCalledTimes(1);
    expect(mockApiClient.mock.calls[0]?.[0]).toBe("/users/u-3");
    expect(mockApiClient.mock.calls[0]?.[1]).toMatchObject({
      method: "PATCH",
      credentials: "include",
    });
  });
});
