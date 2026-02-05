import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { Ride, RideList } from "@/types";

type RidesResponse = { rides: RideList[] };
type RideResponse = { ride: Ride };

export function useRides(start?: string, end?: string) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ["rides", start, end],
    queryFn: async () => {
      let token: string | undefined;
      if (isAuthenticated) {
        try {
          token = await getAccessTokenSilently();
        } catch {
          // Continue without auth
        }
      }

      const params = new URLSearchParams();
      if (start) params.set("start", start);
      if (end) params.set("end", end);

      const query = params.toString();
      const endpoint = query ? `/rides?${query}` : "/rides";

      const data = await apiClient<RidesResponse>(endpoint, { token });
      return data.rides;
    },
  });
}

export function useRide(id: string) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ["ride", id],
    queryFn: async () => {
      let token: string | undefined;
      if (isAuthenticated) {
        try {
          token = await getAccessTokenSilently();
        } catch {
          // Continue without auth
        }
      }

      const data = await apiClient<RideResponse>(`/rides/${id}`, { token });
      return data.ride;
    },
    enabled: !!id,
  });
}

export function useJoinRide() {
  const queryClient = useQueryClient();
  const { getAccessTokenSilently, user } = useAuth0();

  return useMutation({
    mutationFn: async ({
      rideId,
      userId,
    }: {
      rideId: string;
      userId?: string;
    }) => {
      const token = await getAccessTokenSilently();
      return apiClient<{ success: boolean }>(`/rides/${rideId}/join`, {
        method: "POST",
        token,
        body: userId ? JSON.stringify({ userId }) : undefined,
      });
    },
    onMutate: async ({ rideId, userId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["ride", rideId] });
      await queryClient.cancelQueries({ queryKey: ["rides"] });

      // Snapshot previous values
      const previousRide = queryClient.getQueryData<Ride>(["ride", rideId]);
      const previousRides = queryClient.getQueriesData<RideList[]>({
        queryKey: ["rides"],
      });

      const targetUserId = userId ?? user?.sub;

      // Optimistically update ride detail
      if (previousRide && targetUserId) {
        queryClient.setQueryData<Ride>(["ride", rideId], {
          ...previousRide,
          users: [
            ...(previousRide.users ?? []),
            { user: { id: targetUserId } as NonNullable<Ride["users"]>[number]["user"] },
          ],
        });
      }

      // Optimistically update rides list
      queryClient.setQueriesData<RideList[]>({ queryKey: ["rides"] }, (old) =>
        old?.map((ride) =>
          ride.id === rideId
            ? {
                ...ride,
                users: [...(ride.users ?? []), { userId: targetUserId! }],
              }
            : ride,
        ),
      );

      return { previousRide, previousRides };
    },
    onError: (_err, { rideId }, context) => {
      // Rollback on error
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
      // Refetch to ensure consistency
      void queryClient.invalidateQueries({ queryKey: ["ride", rideId] });
      void queryClient.invalidateQueries({ queryKey: ["rides"] });
    },
  });
}

export function useLeaveRide() {
  const queryClient = useQueryClient();
  const { getAccessTokenSilently, user } = useAuth0();

  return useMutation({
    mutationFn: async ({
      rideId,
      userId,
    }: {
      rideId: string;
      userId?: string;
    }) => {
      const token = await getAccessTokenSilently();
      return apiClient<{ success: boolean }>(`/rides/${rideId}/leave`, {
        method: "POST",
        token,
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

      const targetUserId = userId ?? user?.sub;

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
