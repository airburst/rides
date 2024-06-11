import Link from "next/link";
import { ungroupRides } from "../../shared/utils";
import { type Group, type User } from "../types";
import { RideCard } from "./Card";

type Props = {
  group: Group;
  user?: User;
};

export const RideGroup = ({ group, user }: Props) => {
  const rideData = ungroupRides(group);
  const rideDate = rideData.map(({ date }) => date)[0];
  const types = rideData.map(({ rides }) => ({ rides }));

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex w-full justify-center bg-primary p-2 font-bold uppercase tracking-widest text-white sm:rounded">
        <div>{rideDate}</div>
      </div>

      {types.map(({ rides }) =>
        rides.map((ride) => (
          <Link href={`/ride/${ride.id}`}
            id={ride.id}
            key={ride.id}
            className="w-full scroll-mt-16 px-2 md:scroll-mt-24 md:px-0"
          >
            <RideCard ride={ride} user={user} />
          </Link>
        ))
      )}
    </div>
  );
};
