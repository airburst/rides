import { useApiClient } from "@/hooks/useApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateUserInput } from "./types";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApiClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserInput }) => {
      return fetchWithAuth<{ success: boolean; id: string }>(`/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: async (_data, { id }) => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      void queryClient.invalidateQueries({ queryKey: ["user", id] });
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
