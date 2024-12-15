"use client";

import { useRemoveServiceWorkers } from "@/hooks/useRemoveServiceWorkers";

export const UnregisterServiceWorkers = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  useRemoveServiceWorkers();

  return null;
};
