"use client";
import { useOptimisticCleanup } from "@/hooks/useOptimisticCleanup";

/**
 * Client component to handle global optimistic state cleanup
 */
export const OptimisticProvider = () => {
  useOptimisticCleanup();
  return null;
};
