import { env } from "@/env";
import { useBetterAuthLogout, useBetterAuthSession } from "@/hooks/auth";
import { apiClient, ApiError } from "@/lib/api";
import type { Preferences, Role } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

type UserResponse = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    mobile: string | null;
    emergency: string | null;
    role: Role;
    preferences: Preferences | null;
  };
};

export function useSession() {
  const API_URL = env.VITE_API_URL!;
  const authProvider = env.VITE_AUTH_PROVIDER;

  const {
    isAuthenticated: isAuth0Authenticated,
    isLoading: isAuth0Loading,
    user: auth0User,
    getAccessTokenSilently,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0();
  const navigate = useNavigate();
  const betterAuthLogout = useBetterAuthLogout();

  const shouldCheckBetterAuth = !isAuth0Authenticated && !isAuth0Loading;
  const {
    data: betterAuthSession,
    isLoading: isBetterAuthSessionLoading,
  } = useBetterAuthSession(shouldCheckBetterAuth);

  const hasBetterAuthSession = Boolean(
    betterAuthSession?.session && betterAuthSession?.user,
  );

  const isAuthenticated = isAuth0Authenticated || hasBetterAuthSession;

  const {
    data: dbUser,
    isLoading: isUserLoading,
    error,
  } = useQuery({
    queryKey: ["currentUser", isAuth0Authenticated ? "auth0" : "better-auth"],
    queryFn: async () => {
      if (isAuth0Authenticated) {
        const token = await getAccessTokenSilently();
        const data = await apiClient<UserResponse>("/users/me", { token });
        return data.user;
      }

      const response = await fetch(`${API_URL}/users/me`, {
        credentials: "include",
      });

      if (!response.ok) {
        const payload = await response
          .json()
          .catch(() => ({ error: "Request failed" }));
        const message =
          (payload as { error?: string; message?: string }).error ??
          (payload as { error?: string; message?: string }).message ??
          "Request failed";
        throw new ApiError(response.status, message, payload);
      }

      const data = (await response.json()) as UserResponse;
      return data.user;
    },
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (!error || !isAuthenticated) return;

    if (isAuth0Authenticated) {
      if (
        error instanceof ApiError &&
        (error.status === 401 || error.status === 403)
      ) {
        console.error("API auth failed, logging out:", error);
        auth0Logout({ logoutParams: { returnTo: window.location.origin } });
      } else if (!(error instanceof ApiError)) {
        // Auth0 SDK error (login_required, consent_required, etc.)
        console.error("Token error, re-authenticating:", error);
        loginWithRedirect();
      }
    }
  }, [
    error,
    isAuthenticated,
    isAuth0Authenticated,
    auth0Logout,
    loginWithRedirect,
  ]);

  // Redirect new users to profile page to complete mandatory fields
  const needsProfileSetup = Boolean(
    dbUser && (!dbUser.name || !dbUser.mobile || !dbUser.emergency),
  );
  useEffect(() => {
    if (!needsProfileSetup) return;
    if (window.location.pathname === "/profile") return;
    void navigate({ to: "/profile" });
  }, [needsProfileSetup, navigate]);

  const session =
    isAuthenticated && dbUser
      ? {
          user: {
            id: dbUser.id,
            name: dbUser.name ?? auth0User?.name ?? betterAuthSession?.user?.name,
            email: dbUser.email ?? auth0User?.email ?? betterAuthSession?.user?.email,
            image: dbUser.image ?? auth0User?.picture,
            role: dbUser.role,
            preferences: dbUser.preferences,
          },
        }
      : null;

  const login = async () => {
    if (authProvider === "better-auth") {
      await navigate({ to: "/auth/login" });
      return;
    }

    await loginWithRedirect();
  };

  const logout = () => {
    if (isAuth0Authenticated) {
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
      return;
    }

    if (hasBetterAuthSession) {
      betterAuthLogout.mutate();
    }
  };

  return {
    session,
    isLoading:
      isAuth0Loading ||
      (shouldCheckBetterAuth && isBetterAuthSessionLoading) ||
      (isAuthenticated && isUserLoading) ||
      betterAuthLogout.isPending,
    isAuthenticated,
    login,
    logout,
  };
}
