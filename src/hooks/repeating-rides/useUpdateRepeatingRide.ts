import { useApiClient } from "@/hooks/useApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { repeatingRideToDb } from "@utils/repeatingRides";
import type { RepeatingRide } from "./types";

type UpdateResponse = { success: boolean; id: string };

export function useUpdateRepeatingRide() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ride: RepeatingRide) => {
      const dbRide = await repeatingRideToDb(ride);
      return fetchWithAuth<UpdateResponse>(`/repeating-rides/${ride.id}`, {
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
