import { cleanupOptimisticUpdatesAtom } from "@/store";
import { useAtom } from "jotai";
import { useEffect } from "react";

/**
 * Hook to automatically clean up old optimistic updates
 * Should be used in a top-level component that persists across page navigation
 */
export const useOptimisticCleanup = (intervalMs = 10000) => {
  const [, cleanupOptimisticUpdates] = useAtom(cleanupOptimisticUpdatesAtom);

  useEffect(() => {
    const interval = setInterval(() => {
      cleanupOptimisticUpdates();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [cleanupOptimisticUpdates, intervalMs]);
};
