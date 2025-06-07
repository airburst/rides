"use client";

import { CardSkeleton } from "../Card/CardSkeleton";

export type RepeatingRidesListSkeletonProps = {
  numberOfCards?: number;
};

const RepeatingRidesListSkeleton = ({
  numberOfCards = 5,
}: RepeatingRidesListSkeletonProps) => (
  <div className="flex w-full flex-col items-start gap-2">
    <div className="bg-primary flex w-full justify-center p-2 font-bold tracking-widest text-white uppercase sm:rounded">
      <div>Manage Repeating Rides</div>
    </div>

    <div className="w-full px-2 sm:px-0">
      <input
        type="text"
        id="search"
        name="search"
        className="input input-lg my-2 w-full"
        placeholder="Search by name or email"
      />
    </div>

    {Array.from(Array(numberOfCards).keys()).map((key) => (
      <div key={key} className="w-full px-2 md:px-0">
        <CardSkeleton />
      </div>
    ))}
  </div>
);

export default RepeatingRidesListSkeleton;
