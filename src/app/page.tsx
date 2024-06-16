import { MainContent, RideGroup } from "@/components";
import { env } from "@/env";
import { getRides } from "@/server/actions/getRides";
import { getServerAuthSession } from "@/server/auth";
import { formatDate, getQueryDateRange } from "@utils/dates";
import { groupRides } from "@utils/transformRideData";
import type { Metadata } from 'next';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} Ride Planner`,
}

const { start, end } = getQueryDateRange({});

export default async function HomePage() {
  const session = await getServerAuthSession();
  const user = session?.user;
  const { rides, error } = await getRides(start, end);

  if (error) {
    return (
      <MainContent>
        <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
          <div className="flex h-full items-center p-8 pt-32 text-2xl">
            Error loading rides
          </div>
        </div>
      </MainContent>
    );
  }

  const groupedRides = groupRides(rides, undefined, user);
  const ridesFound = groupedRides.length > 0;

  return (
    <MainContent>
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
    </MainContent>
  );
}

/*
  <Filters
    data={makeFilterData(data)}
    isShowing={showFilterMenu}
    closeHandler={closeFilters}
  />
*/