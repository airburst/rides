import { Header } from "@/components/Header/Header";
import { Providers } from "@/components/Providers";
import { Button } from "@/components/ui/button";
import outfitLatinUrl from "@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2?url";
import {
    HeadContent,
    Outlet,
    Scripts,
    createRootRoute,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import appCss from "../styles/globals.css?url";

const APP_NAME = `${import.meta.env.VITE_CLUB_SHORT_NAME ?? "BCC"} Rides`;
const APP_DESCRIPTION = `${import.meta.env.VITE_CLUB_LONG_NAME ?? "Bath Cycling Club"} Ride Planner`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: APP_NAME },
      { name: "description", content: APP_DESCRIPTION },
      { name: "author", content: "Mark Fairhurst" },
      { httpEquiv: "X-UA-Compatible", content: "IE=edge" },
      { name: "msapplication-TileColor", content: "#2b5797" },
      { name: "theme-color", content: "#ffffff" },
      {
        name: "google-site-verification",
        content: "Mo-wRmOnufCVny2ZCkZG6iEZhuO0GMB5jLGUJJ6Ne_0",
      },
    ],
    links: [
      {
        rel: "preload",
        href: outfitLatinUrl,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "stylesheet", href: appCss },
{ rel: "icon", href: "/static/favicon.ico" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/static/favicon-32x32.png",
      },
      {
        rel: "apple-touch-icon",
        href: "/static/apple-touch-icon.png",
      },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),

  component: RootComponent,
  shellComponent: RootDocument,

  notFoundComponent: NotFound,
});

function RootComponent() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Providers>
      <Header />
      <Outlet />
      {mounted && <Toaster position="bottom-center" richColors />}
    </Providers>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <div className="mt-16 flex flex-col items-center justify-center sm:mt-24">
      <div className="flex h-64 items-center justify-center text-8xl text-sky-500">
        <svg
          className="h-24 w-24"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      </div>
      <div className="flex items-center p-4 text-center text-2xl text-neutral-700">
        Sorry - we can&apos;t find this page.
      </div>
      <div className="flex items-center justify-center p-4 text-neutral-700">
        <Button
          onClick={() => window.history.back()}
          type="button"
        >
          BACK
        </Button>
      </div>
    </div>
  );
}
