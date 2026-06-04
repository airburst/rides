import { useApiClient } from "@/hooks/useApiClient";
import type { Ride } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useRideByShortId(shortId: string) {
  const { fetchWithOptionalAuth } = useApiClient();

  return useQuery({
    queryKey: ["ride", "short", shortId],
    queryFn: async () => {
      const data = await fetchWithOptionalAuth<{ ride: Ride }>(
        `/rides?shortId=${shortId}`,
      );
      return data.ride;
    },
    enabled: !!shortId && shortId.length >= 6,
  });
}
