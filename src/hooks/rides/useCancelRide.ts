import { useApiClient } from "@/hooks/useApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Ride, RideList } from "./types";

export function useCancelRide() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApiClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return fetchWithAuth<{ success: boolean }>(`/rides/${id}/cancel`, {
        method: "POST",
      });
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["ride", id] });
      await queryClient.cancelQueries({ queryKey: ["rides"] });

      const previousRide = queryClient.getQueryData<Ride>(["ride", id]);
      const previousRides = queryClient.getQueriesData<RideList[]>({
        queryKey: ["rides"],
      });

      // Optimistically mark as cancelled
      if (previousRide) {
        queryClient.setQueryData<Ride>(["ride", id], {
          ...previousRide,
          cancelled: true,
        });
      }

      queryClient.setQueriesData<RideList[]>({ queryKey: ["rides"] }, (old) =>
        old?.map((ride) =>
          ride.id === id ? { ...ride, cancelled: true } : ride,
        ),
      );

      return { previousRide, previousRides };
    },
    onError: (_err, id, context) => {
      if (context?.previousRide) {
        queryClient.setQueryData(["ride", id], context.previousRide);
      }
      if (context?.previousRides) {
        context.previousRides.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: (_data, _err, id) => {
      void queryClient.invalidateQueries({ queryKey: ["ride", id] });
      void queryClient.invalidateQueries({ queryKey: ["rides"] });
    },
  });
}
