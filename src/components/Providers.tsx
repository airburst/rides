"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

const AUTH0_DOMAIN = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
const AUTH0_CLIENT_ID = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
const AUTH0_AUDIENCE = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE!;

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2 * 60 * 1000, // 2 minutes - data considered fresh
            gcTime: 10 * 60 * 1000, // 10 minutes - cache retention
            refetchOnWindowFocus: false, // Don't refetch when tab regains focus
          },
        },
      }),
  );

  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: typeof window !== "undefined" ? window.location.origin : "",
        audience: AUTH0_AUDIENCE,
      }}
      cacheLocation="localstorage"
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Auth0Provider>
  );
}
