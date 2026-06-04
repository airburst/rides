import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { ApiError } from "@/lib/api";
import { fetchAuthJson } from "./fetchAuth";

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
  };
};

export function useBetterAuthLogin(): UseMutationResult<
  LoginResponse,
  ApiError,
  LoginInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LoginInput) =>
      fetchAuthJson<LoginResponse>("/api/auth/sign-in/email", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(input),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      void queryClient.invalidateQueries({ queryKey: ["betterAuthSession"] });
    },
  });
}
