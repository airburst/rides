"use client";

import { DEFAULT_WEEKS_TO_SHOW } from "@/constants";
import { useFilter } from "@/contexts/FilterContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { type FilterQuery } from "@/types";
import { Filter, FilterX } from "lucide-react";
import { usePathname } from "next/navigation";

export const FilterButton = () => {
  const path = usePathname();
  const shouldShowFilterButton = path === "/";
  const { showFilterMenu, setShowFilterMenu } = useFilter();
  const [filterQuery] = useLocalStorage<FilterQuery>("bcc-filters", {});
  
  const hasFiltersApplied = !!(
    filterQuery.onlyJoined ||
    filterQuery.q ||
    filterQuery.weeksAhead !== DEFAULT_WEEKS_TO_SHOW
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
          <FilterX className="h-6 w-6 fill-white" />
        ) : (
          <Filter className="h-6 w-6 fill-white" />
        )}
      </button>
    </>
  );
};
