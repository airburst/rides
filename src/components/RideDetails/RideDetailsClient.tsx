import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRide } from "@/hooks/useRides";
import { useSession } from "@/hooks/useSession";
import type { Ride, User } from "@/types";
import { isJoinable } from "@utils/dates";
import { formatRideData, hasSpace } from "@utils/rides";
import { MessageSquare, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { BackButton, Button, JoinButton } from "../Button";
import { Spinner } from "../Spinner";
import { RideInfo } from "./RideInfo";
import { RideMessages } from "./RideMessages";
import { RidersGoing } from "./RidersGoing";

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
        <Spinner />
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
  const { name, rideDate, time, cancelled, rideLimit, users } = formattedRide;

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
    <div className="flex min-h-[calc(100svh-5rem)] w-full flex-col gap-2 lg:gap-4 mt-4 sm:min-h-[calc(100svh-7rem)]">
      <RideInfo ride={formattedRide} user={user} />

      {!cancelled && (
        <>
          {!isSpace && (
            <div className="mx-2 sm:mx-0">
              <Alert className="border-warning bg-warning/10">
                <TriangleAlert className="text-warning" />
                <AlertDescription>
                  This ride is full. Please contact the leader if you want to
                  join.
                </AlertDescription>
              </Alert>
            </div>
          )}
          <RidersGoing
            user={user}
            users={userList}
            hasRiders={hasRiders}
            isLeader={isLeader}
            ridersLabel={ridersLabel}
          />
        </>
      )}

      <RideMessages
        userId={user?.id}
        rideId={id}
        messages={rideNotes}
        showNotesForm={showNotesForm}
        closeHandler={closeNotes}
      />

      <div className="sticky bottom-0 z-10 mt-auto border-t border-neutral-200 bg-white pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-2 p-2">
          <BackButton className="ps-1 pe-1" />

          {!cancelled && isGoing && (
            <Button outline className="ps-1 pe-1" onClick={openNotes}>
              <MessageSquare className="h-6 w-6" />
              NOTE
            </Button>
          )}

          {!cancelled && user && (canJoin || isGoing) && (
            <JoinButton
              className="ps-1 pe-1"
              going={isGoing}
              ariaLabel={`Join ${name} ride`}
              rideId={id}
              userId={user.id}
            />
          )}
        </div>
      </div>
    </div>
  );
}
