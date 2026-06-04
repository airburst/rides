import { useApiClient } from "@/hooks/useApiClient";
import { useQuery } from "@tanstack/react-query";
import type { User } from "./types";

type UsersResponse = { users: User[] };

export function useUsers(query?: string) {
  const { fetchWithAuth, isAuthenticated, isAuthResolved } = useApiClient();

  const params = query ? `?q=${encodeURIComponent(query)}` : "";

  return useQuery({
    queryKey: ["users", query],
    queryFn: async () => {
      const data = await fetchWithAuth<UsersResponse>(`/users${params}`);
      return data.users;
    },
    enabled: isAuthenticated && isAuthResolved,
  });
}
