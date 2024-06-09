"use client";
import { useState } from "react";
import { hasSpace, isJoinable } from "../../../shared/utils";
import { type Ride, type User } from "../../types";
import { Badge } from "../Badge";
import { BackButton, Button, JoinButton } from "../Button";
import { MessageIcon } from "../Icon";
import { RideInfo } from "./RideInfo";
import { RideNotes } from "./RideNotes";
import { RidersGoing } from "./RidersGoing";

type RowProps = {
  children: JSX.Element | JSX.Element[] | null | undefined;
};

const Heading = ({ children }: RowProps) => (
  <div className="flex w-full flex-row items-center justify-center bg-primary p-2 font-bold uppercase tracking-wide text-white sm:rounded">
    {children}
  </div>
);

type Props = {
  ride: Ride;
  user?: User;
  role?: string;
  embedded?: boolean;
};

export const RideDetails = ({ ride, user, role, embedded }: Props) => {
  const [showNotesForm, setShowNotesForm] = useState<boolean>(false);
  const { id, name, rideDate, day, cancelled, limit, users } = ride;

  const hasRiders = users && users?.length > 0;
  const isGoing =
    users && user ? users?.map((u: User) => u.id).includes(user?.id) : false;
  const isLeader = ["ADMIN", "LEADER"].includes(role ?? "");
  const isSpace = hasSpace(ride);
  const canJoin = isJoinable(rideDate) && isSpace;
  const rideNotes =
    users && user && users?.find((u: User) => u.id === user.id)?.rideNotes;
  const riderCount = users?.length ?? 0;
  const hasLimit = limit && limit > -1;
  const ridersLabel = hasLimit ? `${riderCount}/${limit}` : riderCount;

  const openNotes = () => setShowNotesForm(true);
  const closeNotes = () => setShowNotesForm(false);

  return (
    <div className="flex w-full flex-col gap-2">
      <Heading>
        <div>{day}</div>
      </Heading>

      <RideInfo ride={ride} />

      <Heading>
        <div className="flex items-center gap-4">
          Going
          <Badge text={ridersLabel} />
        </div>
      </Heading>

      {embedded ? (
        <div className="flex h-4 flex-row justify-between px-2 pt-2 sm:px-0">
          <BackButton url="/embed" />
        </div>
      ) : (
        <>
          {!isSpace && (
            <div className="mx-2 sm:mx-0">
              <div className="alert alert-warning">
                This ride is full. Please contact the leader if you want to
                join.
              </div>
            </div>
          )}
          <RidersGoing
            user={user}
            users={users}
            hasRiders={hasRiders}
            isLeader={isLeader}
          />
          <div className="flex h-4 flex-row justify-between px-2 pt-2 sm:px-0">
            <BackButton url={`/#${id}`} />

            {isGoing && !cancelled && (
              <Button accent onClick={openNotes}>
                <MessageIcon className="fill-white" />
                Message
              </Button>
            )}

            {user && (canJoin || isGoing) && !cancelled && (
              <JoinButton
                going={isGoing}
                ariaLabel={`Join ${name} ride`}
                rideId={id}
                userId={user?.id}
              />
            )}
          </div>
        </>
      )}

      <RideNotes
        userId={user?.id}
        rideId={id}
        rideNotes={rideNotes}
        showNotesForm={showNotesForm}
        closeHandler={closeNotes}
      />
    </div>
  );
};
