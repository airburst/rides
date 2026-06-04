import { useApiClient } from "@/hooks/useApiClient";
import { useQuery } from "@tanstack/react-query";
import type { RidesResponse } from "./types";

export function useRides(start?: string, end?: string) {
  const { fetchWithOptionalAuth } = useApiClient();

  // Use date-only keys for stable caching (ignore time component)
  const startDate = start?.split("T")[0];
  const endDate = end?.split("T")[0];

  return useQuery({
    queryKey: ["rides", startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.set("start", startDate);
      if (endDate) params.set("end", endDate);

      const query = params.toString();
      const endpoint = query ? `/rides?${query}` : "/rides";

      const data = await fetchWithOptionalAuth<RidesResponse>(endpoint);
      return data.rides;
    },
  });
}
