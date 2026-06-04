import { useApiClient } from "@/hooks/useApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateRideInput } from "./types";

export function useCreateRide() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApiClient();

  return useMutation({
    mutationFn: async (data: CreateRideInput) => {
      return fetchWithAuth<{ success: boolean; id: string }>("/rides", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["rides"] });
    },
  });
}
