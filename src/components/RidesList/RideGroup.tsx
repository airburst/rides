import { ungroupRides } from "@utils/transformRideData";
import { type Group, type User } from "../../types";
import { SwipeableRideCard } from "../Card/SwipeableRideCard";

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
      <div className="sticky top-16 z-10 flex w-full justify-center bg-primary p-2 font-bold uppercase tracking-widest text-white sm:top-24 sm:rounded">
        <div>{rideDate}</div>
      </div>

      {types.map(({ rides }) =>
        rides.map((ride) => (
          <div key={ride.id} className="w-full px-2 md:px-0">
            <SwipeableRideCard ride={ride} user={user} />
          </div>
        )),
      )}
    </div>
  );
};
