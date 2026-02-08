import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { repeatingRideToDb } from "@utils/repeatingRides";
import type { RepeatingRide } from "./types";

type UpdateResponse = { success: boolean; id: string };

export function useUpdateRepeatingRide() {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ride: RepeatingRide) => {
      const token = await getAccessTokenSilently();
      const dbRide = repeatingRideToDb(ride);
      return apiClient<UpdateResponse>(`/repeating-rides/${ride.id}`, {
        token,
        method: "PUT",
        body: JSON.stringify(dbRide),
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["repeating-rides"] });
      queryClient.invalidateQueries({
        queryKey: ["repeating-ride", variables.id],
      });
    },
  });
}
