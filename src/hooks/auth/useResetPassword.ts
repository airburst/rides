import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { ApiError } from "@/lib/api";
import { fetchAuthJson } from "./fetchAuth";

export type ResetPasswordInput = {
  token: string;
  newPassword: string;
};

export function useResetPassword(): UseMutationResult<
  void,
  ApiError,
  ResetPasswordInput
> {
  return useMutation({
    mutationFn: async (input: ResetPasswordInput) => {
      await fetchAuthJson<{ status?: boolean }>("/api/auth/reset-password", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(input),
      });
    },
  });
}
