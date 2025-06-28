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
};

export const JoinButton: React.FC<Props> = ({
  going,
  rideId,
  userId,
  ...props
}: Props) => {
  const [, addOptimisticUpdate] = useAtom(addOptimisticRideUpdateAtom);
  const [, removeOptimisticUpdate] = useAtom(removeOptimisticRideUpdateAtom);

  const handleJoin = async () => {
    // Optimistically update global state
    addOptimisticUpdate({ rideId, userId, action: "join" });

    try {
      const result = await joinRide({ rideId, userId });
      if (!result.success) {
        // Revert optimistic update on failure
        removeOptimisticUpdate({ rideId, userId });
      }
    } catch {
      // Revert optimistic update on error
      removeOptimisticUpdate({ rideId, userId });
    }
  };

  const handleLeave = async () => {
    // Optimistically update global state
    addOptimisticUpdate({ rideId, userId, action: "leave" });

    try {
      const result = await leaveRide({ rideId, userId });
      if (!result.success) {
        // Revert optimistic update on failure
        removeOptimisticUpdate({ rideId, userId });
      }
    } catch {
      // Revert optimistic update on error
      removeOptimisticUpdate({ rideId, userId });
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
