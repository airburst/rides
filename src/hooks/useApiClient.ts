import { useBetterAuthSession } from "@/hooks/auth";
import { apiClient } from "@/lib/api";
import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

export function useApiClient() {
  const {
    getAccessTokenSilently,
    isAuthenticated: isAuth0Authenticated,
    isLoading: isAuth0Loading,
  } = useAuth0();

  const shouldCheckBetterAuth = !isAuth0Authenticated && !isAuth0Loading;
  const {
    data: betterAuthSession,
    isLoading: isBetterAuthSessionLoading,
  } = useBetterAuthSession(shouldCheckBetterAuth);

  const hasBetterAuthSession = Boolean(
    betterAuthSession?.session && betterAuthSession?.user,
  );

  const isAuthenticated = isAuth0Authenticated || hasBetterAuthSession;
  const isAuthResolved =
    !isAuth0Loading &&
    (!shouldCheckBetterAuth || !isBetterAuthSessionLoading);

  const fetchWithAuth = useCallback(
    async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
      if (isAuth0Authenticated) {
        const token = await getAccessTokenSilently();
        return apiClient<T>(endpoint, { ...options, token });
      }

      if (hasBetterAuthSession) {
        return apiClient<T>(endpoint, {
          ...options,
          credentials: "include",
        });
      }

      throw new Error("Not authenticated");
    },
    [getAccessTokenSilently, hasBetterAuthSession, isAuth0Authenticated],
  );

  const fetchWithOptionalAuth = useCallback(
    async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
      if (isAuth0Authenticated) {
        try {
          const token = await getAccessTokenSilently();
          return apiClient<T>(endpoint, { ...options, token });
        } catch {
          // Continue without auth if token acquisition fails
        }
      }

      if (hasBetterAuthSession) {
        return apiClient<T>(endpoint, {
          ...options,
          credentials: "include",
        });
      }

      return apiClient<T>(endpoint, options);
    },
    [getAccessTokenSilently, hasBetterAuthSession, isAuth0Authenticated],
  );

  return {
    fetchWithAuth,
    fetchWithOptionalAuth,
    isAuthenticated,
    isAuthResolved,
    authType: isAuth0Authenticated
      ? "auth0"
      : hasBetterAuthSession
        ? "better-auth"
        : null,
  };
}
