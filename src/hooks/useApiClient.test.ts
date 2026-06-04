import { beforeEach, describe, expect, it, mock } from "bun:test";
import { renderHook } from "@testing-library/react";
import { TestWrapper } from "@/test-utils";

const mockApiClient = mock(async () => ({ ok: true }));

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

const { useApiClient } = await import("./useApiClient");

describe("useApiClient", () => {
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

  it("uses bearer token when Auth0 is authenticated", async () => {
    auth0State.isAuthenticated = true;

    const { result } = renderHook(() => useApiClient(), {
      wrapper: TestWrapper,
    });

    await result.current.fetchWithAuth("/users/me");

    expect(mockApiClient).toHaveBeenCalledTimes(1);
    expect(mockApiClient.mock.calls[0]?.[0]).toBe("/users/me");
    expect(mockApiClient.mock.calls[0]?.[1]).toMatchObject({
      token: "auth0-token",
    });
  });

  it("uses cookie credentials when better-auth session exists", async () => {
    betterAuthSessionState = {
      session: { id: "sess-1", expiresAt: "2099-01-01T00:00:00.000Z" },
      user: {
        id: "user-1",
        name: "Test User",
        email: "user@example.com",
        emailVerified: true,
      },
    };

    const { result } = renderHook(() => useApiClient(), {
      wrapper: TestWrapper,
    });

    await result.current.fetchWithAuth("/users/me");

    expect(mockApiClient).toHaveBeenCalledTimes(1);
    expect(mockApiClient.mock.calls[0]?.[1]).toMatchObject({
      credentials: "include",
    });
  });

  it("optional auth falls back to unauthenticated request", async () => {
    const { result } = renderHook(() => useApiClient(), {
      wrapper: TestWrapper,
    });

    await result.current.fetchWithOptionalAuth("/rides");

    expect(mockApiClient).toHaveBeenCalledTimes(1);
    expect(mockApiClient.mock.calls[0]?.[1]).toEqual({});
  });
});
