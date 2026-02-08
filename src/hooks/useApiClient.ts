import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";
import { apiClient } from "@/lib/api";

export function useApiClient() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const fetchWithAuth = useCallback(
    async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
      let token: string | undefined;

      if (isAuthenticated) {
        try {
          token = await getAccessTokenSilently();
        } catch {
          // Token fetch failed, continue without auth
        }
      }

      return apiClient<T>(endpoint, { ...options, token });
    },
    [getAccessTokenSilently, isAuthenticated],
  );

  return { fetchWithAuth };
}
