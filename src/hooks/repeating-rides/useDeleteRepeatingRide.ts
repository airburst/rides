import { useApiClient } from "@/hooks/useApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DeleteResponse = {
  success: boolean;
  id: string;
  deletedRideCount?: number;
};
type DeleteInput = { id: string; cascade?: boolean };

export function useDeleteRepeatingRide() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, cascade }: DeleteInput) => {
      const query = cascade ? "?cascade=true" : "";
      return fetchWithAuth<DeleteResponse>(`/repeating-rides/${id}${query}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repeating-rides"] });
      queryClient.invalidateQueries({ queryKey: ["rides"] });
    },
  });
}
