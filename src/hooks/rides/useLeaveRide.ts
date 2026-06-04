import { useApiClient } from "@/hooks/useApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Ride, RideList } from "./types";

export function useLeaveRide() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApiClient();

  return useMutation({
    mutationFn: async ({
      rideId,
      userId,
    }: {
      rideId: string;
      userId?: string;
    }) => {
      return fetchWithAuth<{ success: boolean }>(`/rides/${rideId}/leave`, {
        method: "POST",
        body: userId ? JSON.stringify({ userId }) : undefined,
      });
    },
    onMutate: async ({ rideId, userId }) => {
      await queryClient.cancelQueries({ queryKey: ["ride", rideId] });
      await queryClient.cancelQueries({ queryKey: ["rides"] });

      const previousRide = queryClient.getQueryData<Ride>(["ride", rideId]);
      const previousRides = queryClient.getQueriesData<RideList[]>({
        queryKey: ["rides"],
      });

      const targetUserId = userId;

      // Optimistically update ride detail
      if (previousRide && targetUserId) {
        queryClient.setQueryData<Ride>(["ride", rideId], {
          ...previousRide,
          users: previousRide.users?.filter((u) => u.user.id !== targetUserId),
        });
      }

      // Optimistically update rides list
      queryClient.setQueriesData<RideList[]>({ queryKey: ["rides"] }, (old) =>
        old?.map((ride) =>
          ride.id === rideId
            ? {
                ...ride,
                users: ride.users?.filter((u) => u.userId !== targetUserId),
              }
            : ride,
        ),
      );

      return { previousRide, previousRides };
    },
    onError: (_err, { rideId }, context) => {
      if (context?.previousRide) {
        queryClient.setQueryData(["ride", rideId], context.previousRide);
      }
      if (context?.previousRides) {
        context.previousRides.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: (_data, _err, { rideId }) => {
      void queryClient.invalidateQueries({ queryKey: ["ride", rideId] });
      void queryClient.invalidateQueries({ queryKey: ["rides"] });
    },
  });
}
