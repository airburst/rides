import { useApiClient } from "@/hooks/useApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateRideInput } from "./types";

export function useUpdateRide() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApiClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRideInput }) => {
      return fetchWithAuth<{ success: boolean; id: string }>(`/rides/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSettled: (_data, _err, { id }) => {
      void queryClient.invalidateQueries({ queryKey: ["ride", id] });
      void queryClient.invalidateQueries({ queryKey: ["rides"] });
    },
  });
}
