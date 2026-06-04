import { useApiClient } from "@/hooks/useApiClient";
import { useQuery } from "@tanstack/react-query";
import type { RideResponse } from "./types";

export function useRide(id: string) {
  const { fetchWithOptionalAuth } = useApiClient();

  return useQuery({
    queryKey: ["ride", id],
    queryFn: async () => {
      const data = await fetchWithOptionalAuth<RideResponse>(`/rides/${id}`);
      return data.ride;
    },
    enabled: !!id,
  });
}
