import { atom } from "jotai";

// Store optimistic ride membership updates globally
// This allows optimistic updates to persist across page navigation
export interface RideMembershipUpdate {
  rideId: string;
  userId: string;
  action: "join" | "leave";
  timestamp: number;
}

// Atom to store pending optimistic updates
export const optimisticRideUpdatesAtom = atom<RideMembershipUpdate[]>([]);

// Atom to add an optimistic update
export const addOptimisticRideUpdateAtom = atom(
  null,
  (get, set, update: Omit<RideMembershipUpdate, "timestamp">) => {
    const updates = get(optimisticRideUpdatesAtom);
    const newUpdate: RideMembershipUpdate = {
      ...update,
      timestamp: Date.now(),
    };

    // Remove any existing update for the same ride and user
    const filteredUpdates = updates.filter(
      (u) => !(u.rideId === update.rideId && u.userId === update.userId),
    );

    const newUpdates = [...filteredUpdates, newUpdate];
    set(optimisticRideUpdatesAtom, newUpdates);
  },
);

// Atom to remove completed updates (called after server action succeeds)
export const removeOptimisticRideUpdateAtom = atom(
  null,
  (get, set, { rideId, userId }: { rideId: string; userId: string }) => {
    const updates = get(optimisticRideUpdatesAtom);
    const filteredUpdates = updates.filter((u) => !(u.rideId === rideId && u.userId === userId));
    set(optimisticRideUpdatesAtom, filteredUpdates);
  },
);

// Atom to clean up old optimistic updates (called periodically)
export const cleanupOptimisticUpdatesAtom = atom(null, (get, set, maxAgeMs = 30000) => {
  // Default: 30 seconds
  const updates = get(optimisticRideUpdatesAtom);
  const now = Date.now();
  const validUpdates = updates.filter((u) => now - u.timestamp < (maxAgeMs as number));
  set(optimisticRideUpdatesAtom, validUpdates);
});

// Helper atom to get optimistic membership status for a ride and user
export const getOptimisticMembershipAtom = atom(
  (get) => (rideId: string, userId: string, originalStatus: boolean) => {
    const updates = get(optimisticRideUpdatesAtom);
    const relevantUpdate = updates.find((u) => u.rideId === rideId && u.userId === userId);

    if (!relevantUpdate) {
      return originalStatus;
    }

    return relevantUpdate.action === "join";
  },
);

// Helper atom to get optimistic rider count for a ride
export const getOptimisticRiderCountAtom = atom(
  (get) => (rideId: string, originalCount: number, userIds: string[]) => {
    const updates = get(optimisticRideUpdatesAtom);
    const rideUpdates = updates.filter((u) => u.rideId === rideId);

    let count = originalCount;

    rideUpdates.forEach((update) => {
      const userWasInRide = userIds.includes(update.userId);

      if (update.action === "join" && !userWasInRide) {
        count++;
      } else if (update.action === "leave" && userWasInRide) {
        count--;
      }
    });

    return count;
  },
);

// Helper atom to get optimistically updated user list for a ride
export const getOptimisticRiderListAtom = atom(
  (get) =>
    <T extends { id: string }>(
      rideId: string,
      originalUsers: T[],
      currentUser?: { id: string } & T,
    ) => {
      const updates = get(optimisticRideUpdatesAtom);
      const rideUpdates = updates.filter((u) => u.rideId === rideId);

      const users = [...originalUsers];

      rideUpdates.forEach((update) => {
        const userIndex = users.findIndex((u) => u.id === update.userId);

        if (update.action === "join" && userIndex === -1 && currentUser?.id === update.userId) {
          // Add the current user to the list
          users.push(currentUser);
        } else if (update.action === "leave" && userIndex !== -1) {
          // Remove the user from the list
          users.splice(userIndex, 1);
        }
      });

      return users;
    },
);
