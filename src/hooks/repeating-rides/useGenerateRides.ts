import { useApiClient } from "@/hooks/useApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ scheduleId, date }: GenerateInput) => {
      return fetchWithAuth<GenerateResponse>("/generate", {
        method: "POST",
        body: JSON.stringify({ scheduleId, date }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides"] });
    },
  });
}
