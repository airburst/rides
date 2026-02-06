import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { RidesResponse } from "./types";

export function useRides(start?: string, end?: string) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Use date-only keys for stable caching (ignore time component)
  const startDate = start?.split("T")[0];
  const endDate = end?.split("T")[0];

  return useQuery({
    queryKey: ["rides", startDate, endDate],
    queryFn: async () => {
      let token: string | undefined;
      if (isAuthenticated) {
        try {
          token = await getAccessTokenSilently();
        } catch {
          // Continue without auth
        }
      }

      const params = new URLSearchParams();
      if (start) params.set("start", start);
      if (end) params.set("end", end);

      const query = params.toString();
      const endpoint = query ? `/rides?${query}` : "/rides";

      const data = await apiClient<RidesResponse>(endpoint, { token });
      return data.rides;
    },
  });
}
