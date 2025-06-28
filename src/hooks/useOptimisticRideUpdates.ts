import {
  optimisticRideUpdatesAtom,
  removeOptimisticRideUpdateAtom,
} from "@/store";
import { useAtom } from "jotai";

/**
 * Hook for manually managing optimistic ride updates
 */
export const useOptimisticRideUpdates = () => {
  const [updates] = useAtom(optimisticRideUpdatesAtom);
  const [, removeUpdate] = useAtom(removeOptimisticRideUpdateAtom);

  const clearAllUpdates = () => {
    updates.forEach((update) => {
      removeUpdate({ rideId: update.rideId, userId: update.userId });
    });
  };

  const clearUpdatesForRide = (rideId: string) => {
    const rideUpdates = updates.filter((u) => u.rideId === rideId);
    rideUpdates.forEach((update) => {
      removeUpdate({ rideId: update.rideId, userId: update.userId });
    });
  };

  const clearUpdatesForUser = (userId: string) => {
    const userUpdates = updates.filter((u) => u.userId === userId);
    userUpdates.forEach((update) => {
      removeUpdate({ rideId: update.rideId, userId: update.userId });
    });
  };

  return {
    updates,
    clearAllUpdates,
    clearUpdatesForRide,
    clearUpdatesForUser,
  };
};
