import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { RideResponse } from "./types";

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
