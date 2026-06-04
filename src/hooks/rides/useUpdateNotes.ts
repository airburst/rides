import { useApiClient } from "@/hooks/useApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateNotes() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApiClient();

  return useMutation({
    mutationFn: async ({
      rideId,
      userId,
      notes,
    }: {
      rideId: string;
      userId: string;
      notes: string;
    }) => {
      return fetchWithAuth<{ success: boolean }>(`/rides/${rideId}/notes`, {
        method: "PATCH",
        body: JSON.stringify({ userId, notes }),
      });
    },
    onSettled: (_data, _err, { rideId }) => {
      void queryClient.invalidateQueries({ queryKey: ["ride", rideId] });
    },
  });
}
