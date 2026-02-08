"use client";

import { useFilter } from "@/contexts/FilterContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRides } from "@/hooks/useRides";
import { useSession } from "@/hooks/useSession";
import type { FilterQuery, User } from "@/types";
import { getQueryDateRange } from "@utils/dates";
import { makeFilterData } from "@utils/rides";
import { groupRides } from "@utils/transformRideData";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiltersPanel } from "../Filters";
import { RideGroup } from "./RideGroup";
import RidesListSkeleton from "./RidesListSkeleton";

export type RidesListClientProps = {
  date?: string;
};

export function RidesListClient({ date }: RidesListClientProps) {
  const { session } = useSession();
  // Cast to User - only id is needed for filtering
  const user = session?.user as User | undefined;

  // Memoize date range to prevent query key changes on re-render
  const { start, end } = useMemo(
    () => getQueryDateRange({ start: date, end: date }),
    [date],
  );
  const { data: rides, isPending, error } = useRides(start, end);

  const { showFilterMenu, setShowFilterMenu } = useFilter();
  const [filterQuery, setFilterQuery] = useState<FilterQuery>({});
  const [filters] = useLocalStorage<FilterQuery>("bcc-filters", {});
  const path = usePathname();
  const shouldApplyFilters = path === "/";

  useEffect(() => {
    setFilterQuery(filters);
  }, [filters]);

  // Show skeleton on initial load (no cached data)
  if (isPending && !rides) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
        <RidesListSkeleton numberOfCards={4} />
        <RidesListSkeleton numberOfCards={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
        <div className="flex h-full items-center p-8 pt-32 text-2xl">
          Error loading rides
        </div>
      </div>
    );
  }

  const groupedRides = shouldApplyFilters
    ? groupRides(rides ?? [], filterQuery, user)
    : groupRides(rides ?? [], undefined, user);
  const ridesFound = groupedRides.length > 0;

  return (
    <>
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
            No planned rides
          </div>
        )}
      </div>

      <FiltersPanel
        data={makeFilterData(rides ?? [])}
        isShowing={showFilterMenu}
        closeHandler={() => setShowFilterMenu(false)}
        filterQuery={filterQuery}
        setFilterQuery={setFilterQuery}
      />
    </>
  );
}
