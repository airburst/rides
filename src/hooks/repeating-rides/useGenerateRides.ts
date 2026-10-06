import { useApiClient } from "@/hooks/useApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type GenerateResponse = {
  success: boolean;
  error?: string;
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
      const response = await fetchWithAuth<GenerateResponse>(
        `/repeating-rides/${encodeURIComponent(scheduleId)}/generate`,
        {
          method: "POST",
          body: JSON.stringify({ date }),
        },
      );
      if (
        !response.success ||
        response.results?.some((result) => result.error)
      ) {
        throw new Error(
          response.error ??
            response.results?.find((result) => result.error)?.error ??
            "Failed to generate rides",
        );
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides"] });
    },
  });
}
