"use client";
import { joinRide } from "@/server/actions/join-ride";
import { leaveRide } from "@/server/actions/leave-ride";
import {
  addOptimisticRideUpdateAtom,
  removeOptimisticRideUpdateAtom,
} from "@/store";
import { useAtom } from "jotai";
import { Plus, X } from "lucide-react";
import { Button, type ButtonProps } from "./Button";

type Props = ButtonProps & {
  rideId: string;
  userId: string;
  going?: boolean;
  toggleGoing?: () => void;
};

export const JoinButton: React.FC<Props> = ({
  going,
  rideId,
  userId,
  toggleGoing,
  ...props
}: Props) => {
  const [, addOptimisticUpdate] = useAtom(addOptimisticRideUpdateAtom);
  const [, removeOptimisticUpdate] = useAtom(removeOptimisticRideUpdateAtom);

  const handleJoin = async () => {
    // Optimistically update global state
    addOptimisticUpdate({ rideId, userId, action: "join" });

    // Also call local toggle for immediate UI feedback
    toggleGoing?.();

    try {
      const result = await joinRide({ rideId, userId });
      if (result.success) {
        // Remove optimistic update since server action succeeded
        removeOptimisticUpdate({ rideId, userId });
      } else {
        // Revert optimistic update on failure
        addOptimisticUpdate({ rideId, userId, action: "leave" });
        toggleGoing?.(); // Revert local state too
      }
    } catch {
      // Revert optimistic update on error
      addOptimisticUpdate({ rideId, userId, action: "leave" });
      toggleGoing?.(); // Revert local state too
    }
  };

  const handleLeave = async () => {
    // Optimistically update global state
    addOptimisticUpdate({ rideId, userId, action: "leave" });

    // Also call local toggle for immediate UI feedback
    toggleGoing?.();

    try {
      const result = await leaveRide({ rideId, userId });
      if (result.success) {
        // Remove optimistic update since server action succeeded
        removeOptimisticUpdate({ rideId, userId });
      } else {
        // Revert optimistic update on failure
        addOptimisticUpdate({ rideId, userId, action: "join" });
        toggleGoing?.(); // Revert local state too
      }
    } catch {
      // Revert optimistic update on error
      addOptimisticUpdate({ rideId, userId, action: "join" });
      toggleGoing?.(); // Revert local state too
    }
  };

  return going ? (
    <Button {...props} success onClick={handleLeave}>
      <X className="h-6 w-6" />
      LEAVE
    </Button>
  ) : (
    <Button {...props} error onClick={handleJoin}>
      <Plus className="h-6 w-6" />
      JOIN
    </Button>
  );
};
