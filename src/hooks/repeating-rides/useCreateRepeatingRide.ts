import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { repeatingRideToDb } from "@utils/repeatingRides";
import type { RepeatingRide } from "./types";

type CreateResponse = { success: boolean; id: string };

export function useCreateRepeatingRide() {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ride: RepeatingRide) => {
      const token = await getAccessTokenSilently();
      const dbRide = await repeatingRideToDb(ride);
      return apiClient<CreateResponse>("/repeating-rides", {
        token,
        method: "POST",
        body: JSON.stringify(dbRide),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repeating-rides"] });
    },
  });
}
