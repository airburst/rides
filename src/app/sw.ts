import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { CacheFirst, Serwist, StaleWhileRevalidate } from "serwist";

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
    // Handle images
    {
      matcher({ request }) {
        return request.destination === "image";
      },
      handler: new StaleWhileRevalidate({
        cacheName: "images",
      }),
    },
    // Handle scripts
    {
      matcher({ request }) {
        return request.destination === "script";
      },
      handler: new CacheFirst({
        cacheName: "scripts",
      }),
    },
    // Handle styles
    {
      matcher({ request }) {
        return request.destination === "style";
      },
      handler: new CacheFirst({
        cacheName: "styles",
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
