import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { ApiError } from "@/lib/api";
import { fetchAuthJson } from "./fetchAuth";

export type SessionResponse = {
  session: {
    id: string;
    expiresAt: string;
  } | null;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
  } | null;
};

export function useBetterAuthSession(
  enabled: boolean,
): UseQueryResult<SessionResponse | null> {
  return useQuery({
    queryKey: ["betterAuthSession"],
    queryFn: async () => {
      try {
        return await fetchAuthJson<SessionResponse>("/api/auth/get-session", {
          credentials: "include",
        });
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          return null;
        }

        throw error;
      }
    },
    enabled,
    retry: false,
  });
}
