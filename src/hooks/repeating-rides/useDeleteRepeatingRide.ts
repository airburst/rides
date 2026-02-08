import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

type DeleteResponse = { success: boolean; id: string; deletedRideCount?: number };
type DeleteInput = { id: string; cascade?: boolean };

export function useDeleteRepeatingRide() {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, cascade }: DeleteInput) => {
      const token = await getAccessTokenSilently();
      const query = cascade ? "?cascade=true" : "";
      return apiClient<DeleteResponse>(`/repeating-rides/${id}${query}`, {
        token,
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repeating-rides"] });
      queryClient.invalidateQueries({ queryKey: ["rides"] });
    },
  });
}
