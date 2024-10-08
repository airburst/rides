"use client";
import { formatDistance } from "@utils/rides";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type RideList, type User } from "../../types";
import { Cancelled } from "../RideDetails/Cancelled";
import { BasicCard } from "./BasicCard";

type Props = {
  ride: RideList;
  user?: User;
};

export const RideCard: React.FC<Props> = ({ ride, user }: Props) => {
  const { id, name, time, rideGroup, destination, distance, rideLimit, users } =
    ride;
  const convertedDistance = formatDistance(distance ?? 0, user?.preferences?.units);
  const details = destination
    ? `${destination} - ${convertedDistance}`
    : `${convertedDistance}`;
  const router = useRouter();

  const onPress = () => router.push(`/ride/${id}`);

  if (!id) {
    return null;
  }

  const isCancelled = ride.cancelled ?? false;
  const isGoing = user ? users?.map((u) => u.userId).includes(user.id) : false;
  const riderCount = users?.length ?? 0;
  const hasLimit = rideLimit && rideLimit > -1;
  const ridersLabel = hasLimit ? `${riderCount}/${rideLimit}` : riderCount;

  const cardClass = clsx(
    "grid w-full grid-cols-[auto_1fr_80px]"
  );

  // If a rider is going, span the title across 2 columns to make space
  // else span the entire row (of 3 columns)
  const titleClass = clsx(
    "truncate p-1 pl-2 font-bold uppercase tracking-wide text-neutral-600",
    isGoing ? "col-span-2" : "col-span-3"
  );

  return (
    <BasicCard onPress={onPress}>
      <div className={cardClass}>
        <div className={titleClass}>
          {name}
          {rideGroup ? `: ${rideGroup}` : ""}{" "}
        </div>

        {isGoing && (
          <div className="rounded-tr-md bg-green-700 p-1 px-2 font-bold tracking-wide text-white">
            GOING
          </div>
        )}

        {isCancelled ? (<div className="p-1 col-span-3"><Cancelled /></div>)
          : (<>
            <div className="p-1 pl-2 items-center font-bold tracking-wide text-neutral-700">
              {time}
            </div>
            <div className="truncate p-1 pl-2 items-center">{details}</div>
            {/* Rider count icon */}
            <div className="flex flex-row items-center justify-end gap-2 pr-2">
              <Image
                src="/static/images/biking-neutral-500-64.png"
                width={16}
                height={16}
                alt="Number of riders"
              />
              <span className="text-xl font-bold">{ridersLabel}</span>
            </div>
          </>)}
      </div>

    </BasicCard>
  );
};
