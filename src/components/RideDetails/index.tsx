"use client";
import { isCancelledAtom } from "@/store";
import { useAtom } from "jotai";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { hasSpace, isJoinable } from "../../../shared/utils";
import { type Ride, type User } from "../../types";
import { Badge } from "../Badge";
import { BackButton, Button, JoinButton } from "../Button";
import { RideInfo } from "./RideInfo";
import { RideMessages } from "./RideMessages";
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

export const RideDetails = ({ ride, user, role }: Props) => {
  const [showNotesForm, setShowNotesForm] = useState<boolean>(false);
  const { id, name, rideDate, day, cancelled, rideLimit, users } = ride;

  // Set cancelled state so UserMenu can show or hide cancel action
  const [, setCancelled] = useAtom(isCancelledAtom);

  const userList = users?.map((u: { user: User }) => u.user);
  const hasRiders = users && users?.length > 0;
  const isGoing =
    userList && user ? userList?.map((u: User) => u.id).includes(user?.id) : false;
  const isLeader = ["ADMIN", "LEADER"].includes(role ?? "");
  const isSpace = hasSpace(ride);
  const canJoin = isJoinable(rideDate) && isSpace;
  const rideNotes =
    userList && user && userList?.find((u: User) => u.id === user.id)?.rideNotes;
  const riderCount = users?.length ?? 0;
  const hasLimit = rideLimit && rideLimit > -1;
  const ridersLabel = hasLimit ? `${riderCount}/${rideLimit}` : riderCount;

  const openNotes = () => setShowNotesForm(true);
  const closeNotes = () => setShowNotesForm(false);

  useEffect(() => {
    setCancelled(cancelled ?? false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex w-full flex-col gap-2 md:gap-4">
      <Heading>
        <div>{day}</div>
      </Heading>

      <RideInfo ride={ride} user={user} />

      {cancelled ? (
        <div className="flex mb-16 flex-row justify-between md:justify-start md:gap-4 px-2 pt-2 sm:px-0">
          <BackButton className="md:min-w-32 min-w-28" url={`/#${id}`} />
        </div>
      )
        : (
          <>
            <Heading>
              <div className="flex items-center gap-4">
                Going
                <Badge text={ridersLabel} />
              </div>
            </Heading>
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
              users={userList}
              hasRiders={hasRiders}
              isLeader={isLeader}
            />
            <div className="grid grid-cols-3 mb-16 md:gap-4 gap-2 p-2 sm:px-0 md:max-w-[460px]">
              <BackButton url={`/#${id}`} />

              {isGoing && (
                <Button accent onClick={openNotes}>
                  <MessageSquare className="w-6 h-6" />
                  NOTE
                </Button>
              )}

              {user && (canJoin || isGoing) && (
                <JoinButton
                  going={isGoing}
                  ariaLabel={`Join ${name} ride`}
                  rideId={id!}
                  userId={user?.id}
                />
              )}
            </div>
          </>
        )}

      <RideMessages
        userId={user?.id}
        rideId={id}
        messages={rideNotes}
        showNotesForm={showNotesForm}
        closeHandler={closeNotes}
      />
    </div >
  );
};
