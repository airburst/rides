import { FilterProvider } from "@/contexts/FilterContext";
import { Auth0Provider } from "@auth0/auth0-react";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useEffect, useState, type ReactNode } from "react";

const RIDES_GC_TIME = 24 * 60 * 60 * 1000; // 24 hours

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN!;
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID!;
const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE!;

export function Providers({ children }: { children: ReactNode }) {
  const [persister] = useState(() =>
    createSyncStoragePersister({
      storage: typeof window !== "undefined" ? window.localStorage : null,
      key: "rides-query-cache",
    }),
  );

  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 2 * 60 * 1000, // 2 minutes - data considered fresh
          gcTime: 10 * 60 * 1000, // 10 minutes - cache retention
          refetchOnWindowFocus: false, // Don't refetch when tab regains focus
        },
      },
    });
    // Rides need a longer gcTime so persisted data survives across sessions
    client.setQueryDefaults(["rides"], { gcTime: RIDES_GC_TIME });
    return client;
  });

  // Defer Auth0 init to avoid hydration mismatch (window.location not available during SSR)
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => setAuthReady(true), []);

  const content = (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: RIDES_GC_TIME,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.queryKey[0] === "rides",
        },
      }}
    >
      <FilterProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </FilterProvider>
    </PersistQueryClientProvider>
  );

  if (!authReady) return content;

  const isAndroidOrPWA =
    /android/i.test(navigator.userAgent) ||
    window.matchMedia("(display-mode: standalone)").matches;

  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: AUTH0_AUDIENCE,
        scope: "openid profile email offline_access",
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      useRefreshTokensFallback={isAndroidOrPWA}
    >
      {content}
    </Auth0Provider>
  );
}
