"use client";
import { useJoinRide, useLeaveRide } from "@/hooks/useRides";
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
  const joinMutation = useJoinRide();
  const leaveMutation = useLeaveRide();

  const handleJoin = () => {
    joinMutation.mutate({ rideId, userId });
  };

  const handleLeave = () => {
    leaveMutation.mutate({ rideId, userId });
  };

  const isPending = joinMutation.isPending || leaveMutation.isPending;

  return going ? (
    <Button {...props} success onClick={handleLeave} disabled={isPending}>
      <X className="h-6 w-6" />
      LEAVE
    </Button>
  ) : (
    <Button {...props} error onClick={handleJoin} disabled={isPending}>
      <Plus className="h-6 w-6" />
      JOIN
    </Button>
  );
};
