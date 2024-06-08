// import autoAnimate from "@formkit/auto-animate";
import { useRef } from "react";
import { ungroupRides } from "../../shared/utils";
import { type Group, type User } from "../types";
import { Card, CardSkeleton } from "./Card";

type Props = {
  group: Group;
  user?: User;
};

export const RideGroup = ({ group, user }: Props) => {
  const rideData = ungroupRides(group);
  const rideDate = rideData.map(({ date }) => date)[0];
  const types = rideData.map(({ rides }) => ({ rides }));

  const parent = useRef(null);

  // useEffect(() => {
  //   if (parent.current) {
  //     autoAnimate(parent.current);
  //   }
  // }, [parent]);

  return (
    <div className="flex w-full flex-col items-start gap-2" ref={parent}>
      <div className="flex w-full justify-center bg-primary p-2 font-bold uppercase tracking-widest text-white sm:rounded">
        <div>{rideDate}</div>
      </div>

      {types.map(({ rides }) =>
        rides.map((ride) => (
          <div
            id={ride.id}
            key={ride.id}
            className="w-full scroll-mt-16 px-2 md:scroll-mt-24 md:px-0"
          >
            <Card ride={ride} user={user} />
          </div>
        ))
      )}
    </div>
  );
};

type SkeletonProps = {
  dateText?: string;
  numberOfCards?: number;
};

export const RideGroupSkeleton = ({
  dateText = "SUNDAY 11 NOWONDER",
  numberOfCards = 5,
}: SkeletonProps) => (
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
