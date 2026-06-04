import { useApiClient } from "@/hooks/useApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { repeatingRideToDb } from "@utils/repeatingRides";
import type { RepeatingRide } from "./types";

type CreateResponse = { success: boolean; id: string };

export function useCreateRepeatingRide() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ride: RepeatingRide) => {
      const dbRide = await repeatingRideToDb(ride);
      return fetchWithAuth<CreateResponse>("/repeating-rides", {
        method: "POST",
        body: JSON.stringify(dbRide),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repeating-rides"] });
    },
  });
}
