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
    <Button
      {...props}
      onClick={handleLeave}
      disabled={isPending}
      className="bg-success hover:bg-green-600"
    >
      <X className="h-6 w-6" />
      LEAVE
    </Button>
  ) : (
    <Button
      {...props}
      onClick={handleJoin}
      disabled={isPending}
      className="bg-red-700 hover:bg-red-600"
    >
      <Plus className="h-6 w-6" />
      JOIN
    </Button>
  );
};
