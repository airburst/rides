"use client";
import { joinRide } from "@/server/actions/join-ride";
import { leaveRide } from "@/server/actions/leave-ride";
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
  const handleJoin = async () => {
    toggleGoing?.();
    await joinRide({ rideId, userId });
  };

  const handleLeave = async () => {
    toggleGoing?.();
    await leaveRide({ rideId, userId });
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
