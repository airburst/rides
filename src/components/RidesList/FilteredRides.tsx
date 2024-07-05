"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { filterQueryAtom, showFilterAtom } from "@/store";
import { type FilterQuery, type RideList, type User } from "@/types";
import { makeFilterData } from "@utils/rides";
import { groupRides } from "@utils/transformRideData";
import { useAtom } from "jotai";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { FiltersPanel } from "../Filters";
import { RideGroup } from "./RideGroup";

type Props = {
  rides: RideList[];
  user?: User;
};

export const FilteredRides = ({ rides, user }: Props) => {
  const [showFilterMenu, setShowFilterMenu] = useAtom(showFilterAtom);
  const [filterQuery, setFilterQuery] = useAtom(filterQueryAtom);
  const [filters] = useLocalStorage<FilterQuery>("bcc-filters", {});
  const path = usePathname();
  const shouldApplyFilters = path === "/";

  useEffect(() => {
    setFilterQuery(filters);
  }, [filters, setFilterQuery]);

  const closeFilters = () => setShowFilterMenu(false);

  const groupedRides = shouldApplyFilters
    ? groupRides(rides, filterQuery, user)
    : groupRides(rides, undefined, user);
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
        data={makeFilterData(rides)}
        isShowing={showFilterMenu}
        closeHandler={closeFilters}
      />
    </>
  );
}