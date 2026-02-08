import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { CreateRideInput } from "./types";

export function useCreateRide() {
  const queryClient = useQueryClient();
  const { getAccessTokenSilently } = useAuth0();

  return useMutation({
    mutationFn: async (data: CreateRideInput) => {
      const token = await getAccessTokenSilently();
      return apiClient<{ success: boolean; id: string }>("/rides", {
        method: "POST",
        token,
        body: JSON.stringify(data),
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["rides"] });
    },
  });
}
