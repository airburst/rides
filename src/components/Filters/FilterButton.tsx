import { DEFAULT_WEEKS_TO_SHOW } from "@/constants";
import { useFilter } from "@/contexts/FilterContext";
import { useLocation } from "@tanstack/react-router";
import { Filter, FilterX } from "lucide-react";

export const FilterButton = () => {
  const { pathname } = useLocation();
  const shouldShowFilterButton = pathname === "/";
  const { showFilterMenu, setShowFilterMenu, filterQuery } = useFilter();

  const hasFiltersApplied = !!(
    filterQuery.onlyJoined ||
    filterQuery.q ||
    (filterQuery.weeksAhead && filterQuery.weeksAhead !== DEFAULT_WEEKS_TO_SHOW)
  );

  const toggle = () => setShowFilterMenu(!showFilterMenu);

  if (!shouldShowFilterButton) return null;

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        title="Filter results"
        aria-label="Filter results"
        className="flex cursor-pointer items-center rounded p-1 text-3xl"
      >
        {hasFiltersApplied ? (
          <FilterX className="h-6 w-6" />
        ) : (
          <Filter className="h-6 w-6" />
        )}
      </button>
    </>
  );
};
