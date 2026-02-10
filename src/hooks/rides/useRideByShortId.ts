import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { Ride } from "@/types";

export function useRideByShortId(shortId: string) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ["ride", "short", shortId],
    queryFn: async () => {
      let token: string | undefined;
      if (isAuthenticated) {
        try {
          token = await getAccessTokenSilently();
        } catch {
          // Continue without auth
        }
      }

      const data = await apiClient<{ ride: Ride }>(`/rides?shortId=${shortId}`, {
        token,
      });
      return data.ride;
    },
    enabled: !!shortId && shortId.length >= 6,
  });
}
