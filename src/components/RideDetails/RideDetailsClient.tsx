import { useRide } from "@/hooks/useRides";
import { useSession } from "@/hooks/useSession";
import type { Ride, User } from "@/types";
import { formatRideData, hasSpace } from "@utils/rides";
import { isJoinable } from "@utils/dates";
import { MessageSquare } from "lucide-react";
import { useState, type JSX } from "react";
import { Badge } from "../Badge";
import { BackButton, Button, JoinButton } from "../Button";
import { RideInfo } from "./RideInfo";
import { RideMessages } from "./RideMessages";
import { RidersGoing } from "./RidersGoing";

type RowProps = {
  children: JSX.Element | JSX.Element[] | null | undefined;
};

const Heading = ({ children }: RowProps) => (
  <div className="bg-primary flex w-full flex-row items-center justify-center p-2 font-bold tracking-wide text-white uppercase sm:rounded">
    {children}
  </div>
);

type Props = {
  id: string;
};

export function RideDetailsClient({ id }: Props) {
  const { session } = useSession();
  const user = session?.user as User | undefined;
  const role = user?.role;

  const { data: ride, isPending, error } = useRide(id);
  const [showNotesForm, setShowNotesForm] = useState<boolean>(false);

  // Only show spinner on initial load (no cached data)
  if (isPending && !ride) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error || !ride) {
    return (
      <>
        <div className="flex h-64 w-full items-center justify-center text-2xl">
          {error?.message ?? "This ride is no longer available"}
        </div>
        <div className="mb-16 flex flex-row justify-between px-2 pt-8 sm:px-0">
          <BackButton />
        </div>
      </>
    );
  }

  // Format ride data to extract day/time from rideDate
  const formattedRide = formatRideData(ride) as Ride;
  const { name, rideDate, time, day, cancelled, rideLimit, users } =
    formattedRide;

  const userList = users?.map((u: { user: User }) => u.user) ?? [];
  const isLeader = ["ADMIN", "LEADER"].includes(role ?? "");
  const isSpace = hasSpace(formattedRide);
  const canJoin = isJoinable(rideDate, time) && isSpace;
  const hasLimit = rideLimit && rideLimit > -1;

  const hasRiders = userList.length > 0;
  const isGoing = user ? userList.some((u: User) => u.id === user.id) : false;
  const rideNotes = user
    ? userList.find((u: User) => u.id === user.id)?.rideNotes
    : undefined;
  const riderCount = userList.length;
  const ridersLabel = hasLimit ? `${riderCount}/${rideLimit}` : riderCount;

  const openNotes = () => setShowNotesForm(true);
  const closeNotes = () => setShowNotesForm(false);

  return (
    <div className="flex w-full flex-col gap-2 md:gap-4">
      <Heading>
        <div>{day}</div>
      </Heading>

      <RideInfo ride={formattedRide} user={user} />

      {cancelled ? (
        <div className="mb-16 flex flex-row justify-between px-2 pt-2 sm:px-0 md:justify-start md:gap-4">
          <BackButton className="min-w-28 md:min-w-32" />
        </div>
      ) : (
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
          <div className="mb-16 grid grid-cols-3 gap-2 p-2 sm:px-0 md:max-w-[460px] md:gap-4">
            <BackButton className="ps-[4px] pe-[4px]" />

            {isGoing && (
              <Button accent className="ps-[4px] pe-[4px]" onClick={openNotes}>
                <MessageSquare className="h-6 w-6" />
                NOTE
              </Button>
            )}

            {user && (canJoin || isGoing) && (
              <JoinButton
                className="ps-[4px] pe-[4px]"
                going={isGoing}
                ariaLabel={`Join ${name} ride`}
                rideId={id}
                userId={user.id}
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
    </div>
  );
}
