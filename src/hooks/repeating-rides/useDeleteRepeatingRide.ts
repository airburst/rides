import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

type DeleteResponse = { success: boolean; id: string };

export function useDeleteRepeatingRide() {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getAccessTokenSilently();
      return apiClient<DeleteResponse>(`/repeating-rides/${id}`, {
        token,
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repeating-rides"] });
    },
  });
}
