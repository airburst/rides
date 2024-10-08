import { getRides } from "@/server/actions/get-rides";
import { getServerAuthSession } from "@/server/auth";
import { getQueryDateRange } from "@utils/dates";
import { FilteredRides } from "./FilteredRides";

export type RidesListProps = {
  date?: string;
}

const RidesList = async ({ date }: RidesListProps) => {
  const session = await getServerAuthSession();
  const user = session?.user;
  // Get date range for supplied date, or all rides from today
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

  return (
    <FilteredRides rides={rides} user={user} />
  );
}

export default RidesList;
