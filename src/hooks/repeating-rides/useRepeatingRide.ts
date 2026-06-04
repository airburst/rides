import { useApiClient } from "@/hooks/useApiClient";
import { useQuery } from "@tanstack/react-query";
import { repeatingRideFromDb } from "@utils/repeatingRides";
import type { RepeatingRide, RepeatingRideDb } from "./types";

type RepeatingRideResponse = { repeatingRide: RepeatingRideDb };

export function useRepeatingRide(id: string) {
  const { fetchWithAuth, isAuthenticated, isAuthResolved } = useApiClient();

  return useQuery({
    queryKey: ["repeating-ride", id],
    queryFn: async (): Promise<RepeatingRide> => {
      const data = await fetchWithAuth<RepeatingRideResponse>(
        `/repeating-rides/${id}`,
      );
      return await repeatingRideFromDb(data.repeatingRide);
    },
    enabled: isAuthenticated && isAuthResolved && !!id,
  });
}
