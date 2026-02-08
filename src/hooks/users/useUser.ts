import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { UserResponse } from "./types";

export function useUser(id: string) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error("Not authenticated");
      }

      const token = await getAccessTokenSilently();
      const data = await apiClient<UserResponse>(`/users/${id}`, { token });
      return data.user;
    },
    enabled: !!id && isAuthenticated,
  });
}
