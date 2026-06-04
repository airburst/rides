import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { ApiError } from "@/lib/api";
import { fetchAuthJson } from "./fetchAuth";

export type ResetInput = {
  email: string;
  redirectTo: string;
};

export function useRequestPasswordReset(): UseMutationResult<
  { status: boolean },
  ApiError,
  ResetInput
> {
  return useMutation({
    mutationFn: async (input: ResetInput) =>
      fetchAuthJson<{ status: boolean }>("/api/auth/request-password-reset", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(input),
      }),
  });
}
