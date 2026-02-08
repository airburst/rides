import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export function useUpdateNotes() {
  const queryClient = useQueryClient();
  const { getAccessTokenSilently } = useAuth0();

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
      const token = await getAccessTokenSilently();
      return apiClient<{ success: boolean }>(`/rides/${rideId}/notes`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ userId, notes }),
      });
    },
    onSettled: (_data, _err, { rideId }) => {
      void queryClient.invalidateQueries({ queryKey: ["ride", rideId] });
    },
  });
}
