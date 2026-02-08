import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

type GenerateResponse = {
  success: boolean;
  generateFromDate?: string;
  results?: { scheduleId?: string; count?: number; error?: string }[];
};

type GenerateInput = {
  scheduleId: string;
  date: string;
};

export function useGenerateRides() {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ scheduleId, date }: GenerateInput) => {
      const token = await getAccessTokenSilently();
      return apiClient<GenerateResponse>("/generate", {
        token,
        method: "POST",
        body: JSON.stringify({ scheduleId, date }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides"] });
    },
  });
}
