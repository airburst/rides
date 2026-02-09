import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { repeatingRideFromDb } from "@utils/repeatingRides";
import type { RepeatingRide, RepeatingRideDb } from "./types";

type RepeatingRidesResponse = { repeatingRides: RepeatingRideDb[] };

export function useRepeatingRides() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ["repeating-rides"],
    queryFn: async (): Promise<RepeatingRide[]> => {
      if (!isAuthenticated) {
        throw new Error("Not authenticated");
      }

      const token = await getAccessTokenSilently();
      const data = await apiClient<RepeatingRidesResponse>("/repeating-rides", {
        token,
      });
      // Transform from DB format to editable format
      return await Promise.all(
        data.repeatingRides.map((ride) => repeatingRideFromDb(ride)),
      );
    },
    enabled: isAuthenticated,
  });
}
