import { cn } from "@/lib/utils";
import { formatTime } from "@utils/dates";
import { formatDistance } from "@utils/rides";
import { Bike, Clock } from "lucide-react";
import { type RideList, type User } from "../../types";
import { Cancelled } from "../RideDetails/Cancelled";
import { BasicCard } from "./BasicCard";

type Props = {
  ride: RideList;
  user?: User;
};

export const RideCard: React.FC<Props> = ({ ride, user }: Props) => {
  const {
    id,
    name,
    rideDate,
    rideGroup,
    destination,
    distance,
    rideLimit,
    users,
  } = ride;
  const time = formatTime(rideDate);
  const convertedDistance = formatDistance(
    distance ?? 0,
    user?.preferences?.units,
  );

  if (!id) {
    return null;
  }

  const isCancelled = ride.cancelled ?? false;

  const isGoing = user ? users?.map((u) => u.userId).includes(user.id) : false;

  const riderCount = users?.length ?? 0;
  const hasLimit = rideLimit && rideLimit > -1;
  const ridersLabel = hasLimit ? `${riderCount}/${rideLimit}` : riderCount;

  const cardClass = cn(
    "grid w-full grid-cols-[1fr_1fr_80px] grid-rows-[36px_36px_auto_auto]",
    isGoing && "ring-green-600 ring-2 ring-offset-4 rounded-md",
  );

  const titleClass = cn(
    "truncate p-1 pl-2 text-xl font-semibold tracking-wide text-neutral-600",
    isGoing ? "col-span-2" : "col-span-3",
  );

  return (
    <BasicCard>
      <div className={cardClass}>
        <div className={titleClass}>{name}</div>

        {isGoing && (
          <div className="rounded-md bg-green-700 p-1 px-2 font-bold tracking-wide text-white">
            GOING
          </div>
        )}

        {rideGroup && (
          <div className="col-start-1 col-end-1 flex justify-self-start bg-primary/10 rounded-full px-3 py-1 ml-2 text-sm items-center truncate max-h-8">
            {rideGroup}
          </div>
        )}
        {destination && (
          <div className="col-span-3 truncate p-1 pl-2 text-neutral-600">
            {destination}
          </div>
        )}

        {isCancelled ? (
          <div className="col-span-3 p-1">
            <Cancelled />
          </div>
        ) : (
          <>
            <div className="col-start-1 col-end-1 flex items-center gap-2 p-1 pl-2 font-bold tracking-wide text-neutral-700">
              <Clock className="h-4 w-4 shrink-0 text-neutral-400" />
              {time}
            </div>
            <div className="items-center p-1 pl-2 font-bold tracking-wide text-neutral-700">
              {convertedDistance}
            </div>
            <div className="flex flex-row items-center justify-end gap-2 pr-2">
              <Bike size={20} />
              <span className="font-bold text-neutral-600">{ridersLabel}</span>
            </div>
          </>
        )}
      </div>
    </BasicCard>
  );
};
