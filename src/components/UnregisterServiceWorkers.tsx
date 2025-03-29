"use client";

import { useRemoveServiceWorkers } from "@/hooks/useRemoveServiceWorkers";

export const UnregisterServiceWorkers = () => {
  useRemoveServiceWorkers();

  return null;
};
