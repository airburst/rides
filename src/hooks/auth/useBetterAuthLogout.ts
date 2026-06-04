import { type ApiError } from "@/lib/api";
import {
    useMutation,
    useQueryClient,
    type UseMutationResult,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { fetchAuthJson } from "./fetchAuth";

export function useBetterAuthLogout(): UseMutationResult<void, ApiError, void> {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await fetchAuthJson<{ success?: boolean }>("/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({}),
      });
    },
    onSuccess: () => {
      queryClient.clear();
      void navigate({ to: "/" });
    },
  });
}
