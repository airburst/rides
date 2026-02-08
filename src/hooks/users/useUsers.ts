import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { User } from "./types";

type UsersResponse = { users: User[] };

export function useUsers(query?: string) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const params = query ? `?q=${encodeURIComponent(query)}` : "";

  return useQuery({
    queryKey: ["users", query],
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error("Not authenticated");
      }

      const token = await getAccessTokenSilently();
      const data = await apiClient<UsersResponse>(`/users${params}`, { token });
      return data.users;
    },
    enabled: isAuthenticated,
  });
}
