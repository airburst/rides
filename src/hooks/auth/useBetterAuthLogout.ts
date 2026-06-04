import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ApiError } from "@/lib/api";
import { fetchAuthJson } from "./fetchAuth";

export function useBetterAuthLogout(): UseMutationResult<void, ApiError, void> {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await fetchAuthJson<{ success?: boolean }>("/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      void navigate({ to: "/" });
    },
  });
}
