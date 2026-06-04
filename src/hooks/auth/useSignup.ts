import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { ApiError } from "@/lib/api";
import { fetchAuthJson } from "./fetchAuth";

export type SignupInput = {
  name: string;
  email: string;
  password: string;
};

export type SignupResponse = {
  success: boolean;
  requiresVerification: boolean;
};

export function useSignup(
  slug: string,
): UseMutationResult<SignupResponse, ApiError, SignupInput> {
  return useMutation({
    mutationFn: async (input: SignupInput) =>
      fetchAuthJson<SignupResponse>(`/signup/club/${slug}`, {
        method: "POST",
        body: JSON.stringify(input),
      }),
  });
}
