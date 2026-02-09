import { useFilter } from "@/contexts/FilterContext";
import { type RideList, type User } from "@/types";
import { makeFilterData } from "@utils/rides";
import { groupRides } from "@utils/transformRideData";
import { useLocation } from "@tanstack/react-router";
import { FiltersPanel } from "../Filters";
import { RideGroup } from "./RideGroup";

type Props = {
  rides: RideList[];
  user?: User;
};

export const FilteredRides = ({ rides, user }: Props) => {
  const { showFilterMenu, setShowFilterMenu, filterQuery } = useFilter();
  const { pathname } = useLocation();
  const shouldApplyFilters = pathname === "/";

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
};
