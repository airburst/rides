import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { NetworkFirst, Serwist, StaleWhileRevalidate } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  runtimeCaching: [
    // Handle html pages
    {
      matcher({ request }) {
        return request.destination === "document";
      },
      handler: new NetworkFirst({
        cacheName: "pages",
      }),
    },
    // Handle scripts and manifest
    {
      matcher({ request }) {
        return (
          request.destination === "script" || request.destination === "manifest"
        );
      },
      handler: new NetworkFirst({
        cacheName: "scripts",
      }),
    },
    // Handle images
    {
      matcher({ request }) {
        return request.destination === "image";
      },
      handler: new StaleWhileRevalidate({
        cacheName: "images",
      }),
    },
    // Handle styles
    {
      matcher({ request }) {
        return request.destination === "style";
      },
      handler: new StaleWhileRevalidate({
        cacheName: "styles",
      }),
    },
    // Handle fonts
    {
      matcher({ request }) {
        return request.destination === "font";
      },
      handler: new StaleWhileRevalidate({
        cacheName: "fonts",
      }),
    },
  ],
  // fallbacks: {
  //   entries: [
  //     {
  //       url: "/~offline",
  //       matcher({ request }) {
  //         return request.destination === "document";
  //       },
  //     },
  //   ],
  // },
});

serwist.addEventListeners();
