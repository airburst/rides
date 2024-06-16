"use client";
import { joinRide } from "@/server/actions/joinRide";
import { leaveRide } from "@/server/actions/leaveRide";
import { useState } from "react";
import { CloseIcon, PlusIcon } from "../Icon";
import { Button, type ButtonProps } from "./Button";

type Props = ButtonProps & {
  userId: string;
  rideId: string;
  going?: boolean;
};

export const JoinButton: React.FC<Props> = ({
  going,
  rideId,
  userId,
  ...props
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleJoin = async () => {
    setLoading(true);
    await joinRide(rideId, userId);
    setLoading(false);
  };

  const handleLeave = async () => {
    setLoading(true);
    await leaveRide(rideId, userId);
    setLoading(false);
  };

  return going ? (
    <Button {...props} success loading={loading} onClick={handleLeave}>
      <CloseIcon className="fill-white" />
      LEAVE
    </Button>
  ) : (
    <Button {...props} error loading={loading} onClick={handleJoin}>
      <PlusIcon className="fill-white" />
      JOIN
    </Button>
  );
};
