import { getRides } from "@/server/actions/getRides";
import { getServerAuthSession } from "@/server/auth";
import { formatDate, getQueryDateRange } from "@utils/dates";
import { groupRides } from "@utils/transformRideData";
import { RideGroup } from "./RideGroup";

type Props = {
  date?: string;
}

export const RidesList = async ({ date }: Props) => {
  const session = await getServerAuthSession();
  const user = session?.user;
  const { start, end } = getQueryDateRange({ start: date, end: date });
  const { rides, error } = await getRides(start, end);

  if (error) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
        <div className="flex h-full items-center p-8 pt-32 text-2xl">
          Error loading rides
        </div>
      </div>
    );
  }

  const groupedRides = groupRides(rides, undefined, user);
  const ridesFound = groupedRides.length > 0;

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
      {ridesFound ? (
        <>
          {groupedRides.map((group) => (
            <RideGroup
              key={Object.keys(group)[0]}
              group={group}
              user={user}
            />
          ))}
        </>
      ) : (
        <div className="flex h-full items-center p-8 pt-32 text-2xl">
          No planned rides before {formatDate(end)}
        </div>
      )}
    </div>
  );
}


/*
  <Filters
    data={makeFilterData(data)}
    isShowing={showFilterMenu}
    closeHandler={closeFilters}
  />
*/