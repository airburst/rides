"use client";
import {
  getOptimisticMembershipAtom,
  getOptimisticRiderCountAtom,
} from "@/store";
import { formatDistance } from "@utils/rides";
import clsx from "clsx";
import { useAtom } from "jotai";
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
  const convertedDistance = formatDistance(
    distance ?? 0,
    user?.preferences?.units,
  );
  const details = destination
    ? `${destination} - ${convertedDistance}`
    : `${convertedDistance}`;
  const router = useRouter();

  const [getOptimisticMembership] = useAtom(getOptimisticMembershipAtom);
  const [getOptimisticRiderCount] = useAtom(getOptimisticRiderCountAtom);

  const onPress = () => router.push(`/ride/${id}`);

  if (!id) {
    return null;
  }

  const isCancelled = ride.cancelled ?? false;

  // Get original membership status
  const originalIsGoing = user
    ? users?.map((u) => u.userId).includes(user.id)
    : false;

  // Apply optimistic updates to membership status
  const isGoing = user
    ? getOptimisticMembership(id, user.id, originalIsGoing ?? false)
    : false;

  // Get original rider count
  const originalRiderCount = users?.length ?? 0;

  // Apply optimistic updates to rider count
  const riderCount = getOptimisticRiderCount(
    id,
    originalRiderCount,
    users?.map((u) => u.userId) ?? [],
  );

  const hasLimit = rideLimit && rideLimit > -1;
  const ridersLabel = hasLimit ? `${riderCount}/${rideLimit}` : riderCount;

  const cardClass = clsx("grid w-full grid-cols-[auto_1fr_80px]");

  // If a rider is going, span the title across 2 columns to make space
  // else span the entire row (of 3 columns)
  const titleClass = clsx(
    "truncate p-1 pl-2 font-bold uppercase tracking-wide text-neutral-600",
    isGoing ? "col-span-2" : "col-span-3",
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

        {isCancelled ? (
          <div className="col-span-3 p-1">
            <Cancelled />
          </div>
        ) : (
          <>
            <div className="items-center p-1 pl-2 font-bold tracking-wide text-neutral-700">
              {time}
            </div>
            <div className="items-center truncate p-1 pl-2">{details}</div>
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
          </>
        )}
      </div>
    </BasicCard>
  );
};
