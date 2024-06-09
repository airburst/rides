"use client";
/* eslint-disable @typescript-eslint/no-floating-promises */
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { isReady } from "../../shared/utils";
import { type RideList, type User } from "../types";
import { Cancelled } from "./Cancelled";

type Props = {
  ride: RideList;
  user?: User;
};

export const Card: React.FC<Props> = ({ ride, user }: Props) => {
  const [isSwiping, setSwiping] = useState(false);
  const { id, name, time, rideGroup, destination, distance, limit, users } =
    ride;
  const isNotReady = !isReady(ride);

  const details = destination
    ? `${destination} - ${distance ?? ""}`
    : `${distance ?? ""}`;

  // const targetUrl =
  //   router.pathname === "/embed"
  //     ? `/embed/${id}`
  //     : `/ride/${id}/${rideDate.split("T")[0]}`;

  const onPress = () => console.log("TODO: Navigate to ride details");

  if (!id) {
    return null;
  }

  const isGoing = user ? users?.map((u) => u.userId).includes(user.id) : false;
  const riderCount = users?.length ?? 0;
  const hasLimit = limit && limit > -1;
  const ridersLabel = hasLimit ? `${riderCount}/${limit}` : riderCount;

  const cardClass = clsx(
    "grid w-full grid-cols-[auto_1fr_80px] pl-1 pb-1 border-l-4",
    isNotReady ? "border-red-500 rounded-l" : "border-transparent"
  );

  // If a rider is going, span the title across 2 columns to make space
  // else span the entire row (of 3 columns)
  const titleClass = clsx(
    "truncate p-1 font-bold uppercase tracking-wide",
    isGoing ? "col-span-2" : "col-span-3"
  );

  return (
    <div
      role="presentation"
      className="relative md:mx-autotext-neutral-500 box-border flex w-full cursor-pointer gap-2 rounded bg-white shadow-md hover:text-neutral-700 hover:shadow-lg md:gap-2"
      onMouseDown={() => setSwiping(false)}
      onMouseMove={() => setSwiping(true)}
      onMouseUp={(e) => {
        if (!isSwiping && e.button === 0) {
          onPress();
        }
        setSwiping(false);
      }}
      onTouchStart={() => setSwiping(false)}
      onTouchMove={() => setSwiping(true)}
      onTouchEnd={(e) => {
        if (e.cancelable) e.preventDefault();
        if (!isSwiping) {
          onPress();
        }
        setSwiping(false);
      }}
    >
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

        <div className="p-1 font-bold tracking-wide text-neutral-600">
          {time}
        </div>
        <div className="truncate p-1">{details}</div>
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
      </div>

      <Cancelled cancelled={ride.cancelled ?? false} position="bottom" />
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="md:mx-autotext-neutral-500 box-border flex w-full cursor-pointer gap-2 rounded bg-white shadow-md hover:text-neutral-700 hover:shadow-lg md:gap-2">
    <div className="grid w-full grid-cols-[auto_1fr_68px] pl-1">
      <div className="col-span-2 p-1 font-bold uppercase tracking-wide">
        <Skeleton />
      </div>
      <div className="justify-self-center" />

      <div className="p-1 font-bold tracking-wide text-neutral-600">00:00</div>
      <div className="p-1">
        <Skeleton />{" "}
      </div>
      <div className="flex flex-row items-center justify-center gap-1 p-1">
        <Image
          src="/static/images/biking-neutral-500-64.png"
          width={16}
          height={16}
          alt="Number of riders"
        />
        <span className="text-xl font-bold">0</span>
      </div>
    </div>
  </div>
);
