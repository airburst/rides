import { useApiClient } from "@/hooks/useApiClient";
import { useQuery } from "@tanstack/react-query";
import type { UserResponse } from "./types";

export function useUser(id: string) {
  const { fetchWithAuth, isAuthenticated, isAuthResolved } = useApiClient();

  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const data = await fetchWithAuth<UserResponse>(`/users/${id}`);
      return data.user;
    },
    enabled: !!id && isAuthResolved && isAuthenticated,
  });
}
