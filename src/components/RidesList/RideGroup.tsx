import { Link } from "@tanstack/react-router";
import { ungroupRides } from "@utils/transformRideData";
import { type Group, type User } from "../../types";
import { RideCard } from "../Card/RideCard";

type Props = {
  group: Group;
  user?: User;
};

export const RideGroup = ({ group, user }: Props) => {
  const rideData = ungroupRides(group);
  const rideDate = rideData.map(({ date }) => date)[0];
  const types = rideData.map(({ rides }) => ({ rides }));

  return (
    <div className="flex w-full flex-col items-start gap-2 snap-start scroll-mt-2">
      <div className="flex w-full px-2 font-bold uppercase tracking-widest sm:top-24 sm:rounded text-sm">
        <div>{rideDate}</div>
      </div>

      {types.map(({ rides }) =>
        rides.map((ride) => (
          <Link
            to="/ride/$id"
            params={{ id: ride.id! }}
            id={ride.id}
            key={ride.id}
            className="w-full px-2 md:px-0"
          >
            <RideCard ride={ride} user={user} />
          </Link>
        )),
      )}
    </div>
  );
};
