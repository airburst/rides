"use client";
import { type RepeatingRide } from "@/types";
import { type ChangeEvent, useState } from "react";
import { RepeatingRideCard } from "../Card";

type Props = {
  repeatingRides: RepeatingRide[];
};

export const RepeatingRidesList = ({ repeatingRides }: Props) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.currentTarget.value);
  };

  const rideCount = repeatingRides.length;

  if (rideCount === 0) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
        <div className="flex h-full items-center justify-center p-8 pt-32 text-2xl">
          No repeating rides found
        </div>
      </div>
    );
  }

  const filteredRides = searchText
    ? repeatingRides.filter(({ name, rideGroup, textRule }) =>
      `${name}${rideGroup}${textRule}`
        .toLowerCase()
        .includes(searchText.toLowerCase())
    )
    : repeatingRides;

  return (
    <>
      <div className="w-full px-2 sm:px-0">
        <input
          type="text"
          id="search"
          name="search"
          className="input input-bordered input-lg w-full mb-4"
          placeholder="Search by ride name, group or day"
          onChange={handleSearch}
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-2 md:gap-2 px-2 sm:px-0">
        {filteredRides.map((ride) => (
          <RepeatingRideCard key={ride.id} ride={ride} />
        ))}
      </div>
    </>
  );
}
