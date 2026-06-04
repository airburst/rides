import { useApiClient } from "@/hooks/useApiClient";
import { useQuery } from "@tanstack/react-query";
import { repeatingRideFromDb } from "@utils/repeatingRides";
import type { RepeatingRide, RepeatingRideDb } from "./types";

type RepeatingRidesResponse = { repeatingRides: RepeatingRideDb[] };

export function useRepeatingRides() {
  const { fetchWithAuth, isAuthenticated, isAuthResolved } = useApiClient();

  return useQuery({
    queryKey: ["repeating-rides"],
    queryFn: async (): Promise<RepeatingRide[]> => {
      const data = await fetchWithAuth<RepeatingRidesResponse>(
        "/repeating-rides",
      );
      // Transform from DB format to editable format
      return await Promise.all(
        data.repeatingRides.map((ride) => repeatingRideFromDb(ride)),
      );
    },
    enabled: isAuthenticated && isAuthResolved,
  });
}
