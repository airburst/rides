import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { repeatingRideFromDb } from "@utils/repeatingRides";
import type { RepeatingRide, RepeatingRideDb } from "./types";

type RepeatingRideResponse = { repeatingRide: RepeatingRideDb };

export function useRepeatingRide(id: string) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ["repeating-ride", id],
    queryFn: async (): Promise<RepeatingRide> => {
      if (!isAuthenticated) {
        throw new Error("Not authenticated");
      }

      const token = await getAccessTokenSilently();
      const data = await apiClient<RepeatingRideResponse>(
        `/repeating-rides/${id}`,
        { token },
      );
      return repeatingRideFromDb(data.repeatingRide);
    },
    enabled: isAuthenticated && !!id,
  });
}
