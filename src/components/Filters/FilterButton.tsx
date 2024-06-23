/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { DEFAULT_WEEKS_TO_SHOW } from "@/constants";
import { filterQueryAtom, showFilterAtom } from "@/store";
import { useAtom } from "jotai";
import { FilterIcon, FilterSelectedIcon } from "../Icon";

export const FilterButton = () => {
  // Get reactive data from atom
  const [showFilterMenu, setShowFilterMenu] = useAtom(showFilterAtom);
  const [filterQuery] = useAtom(filterQueryAtom);
  const hasFiltersApplied = !!(filterQuery.onlyJoined
    || filterQuery.q
    || filterQuery.weeksAhead !== DEFAULT_WEEKS_TO_SHOW);

  const toggle = () => setShowFilterMenu(!showFilterMenu);

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        title="Filter results"
        aria-label="Filter results"
        className="flex items-center rounded p-1 text-3xl"
      >
        {hasFiltersApplied ? (
          <FilterSelectedIcon className="fill-white w-6 h-6" />
        ) : (
          <FilterIcon className="fill-white w-6 h-6" />
        )}
      </button>
    </>
  )
}