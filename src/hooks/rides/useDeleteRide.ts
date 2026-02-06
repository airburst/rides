import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { RideList } from "./types";

export function useDeleteRide() {
  const queryClient = useQueryClient();
  const { getAccessTokenSilently } = useAuth0();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getAccessTokenSilently();
      return apiClient<{ success: boolean }>(`/rides/${id}`, {
        method: "DELETE",
        token,
      });
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["rides"] });

      const previousRides = queryClient.getQueriesData<RideList[]>({
        queryKey: ["rides"],
      });

      // Optimistically remove from list
      queryClient.setQueriesData<RideList[]>({ queryKey: ["rides"] }, (old) =>
        old?.filter((ride) => ride.id !== id),
      );

      return { previousRides };
    },
    onError: (_err, _id, context) => {
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
