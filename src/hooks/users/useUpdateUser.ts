import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { UpdateUserInput } from "./types";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { getAccessTokenSilently } = useAuth0();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserInput }) => {
      const token = await getAccessTokenSilently();
      return apiClient<{ success: boolean; id: string }>(`/users/${id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify(data),
      });
    },
    onSettled: (_data, _err, { id }) => {
      void queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });
}
