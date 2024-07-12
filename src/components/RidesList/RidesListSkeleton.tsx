"use client";

import { CardSkeleton } from "../Card/CardSkeleton";

export type RidesListSkeletonProps = {
  dateText?: string;
  numberOfCards?: number;
};

const RidesListSkeleton = ({
  dateText = "SUNDAY 11 NOWONDER",
  numberOfCards = 5,
}: RidesListSkeletonProps) => (
  <div className="flex w-full flex-col items-start gap-2">
    <div className="flex w-full justify-center bg-primary p-2 font-bold uppercase tracking-widest text-white sm:rounded">
      <div>{dateText}</div>
    </div>
    {Array.from(Array(numberOfCards).keys()).map((key) => (
      <div key={key} className="w-full px-2 md:px-0">
        <CardSkeleton />
      </div>
    ))}
  </div>
);

export default RidesListSkeleton;