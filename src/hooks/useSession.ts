import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { apiClient, ApiError } from "@/lib/api";
import type { Role, Preferences } from "@/types";

type UserResponse = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: Role;
    preferences: Preferences | null;
  };
};

export function useSession() {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    user: auth0User,
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const {
    data: dbUser,
    isLoading: isUserLoading,
    error,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const data = await apiClient<UserResponse>("/users/me", { token });
      return data.user;
    },
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (!error || !isAuthenticated) return;

    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      console.error("API auth failed, logging out:", error);
      logout({ logoutParams: { returnTo: window.location.origin } });
    } else if (!(error instanceof ApiError)) {
      // Auth0 SDK error (login_required, consent_required, etc.)
      console.error("Token error, re-authenticating:", error);
      loginWithRedirect();
    }
  }, [error, isAuthenticated, logout, loginWithRedirect]);

  const session =
    isAuthenticated && dbUser
      ? {
          user: {
            id: dbUser.id,
            name: dbUser.name ?? auth0User?.name,
            email: dbUser.email ?? auth0User?.email,
            image: dbUser.image ?? auth0User?.picture,
            role: dbUser.role,
            preferences: dbUser.preferences,
          },
        }
      : null;

  return {
    session,
    isLoading: isAuthLoading || (isAuthenticated && isUserLoading),
    isAuthenticated,
    login: loginWithRedirect,
    logout: () =>
      logout({ logoutParams: { returnTo: window.location.origin } }),
  };
}
