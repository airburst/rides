/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { DEFAULT_WEEKS_TO_SHOW } from "@/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { filterQueryAtom, showFilterAtom } from "@/store";
import { type FilterQuery } from "@/types";
import { makeFilterData } from "@utils/rides";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { FilterIcon, FilterSelectedIcon } from "../Icon";
import { FiltersPanel } from "./FiltersPanel";

export const FilterButton = () => {
  const [filters] = useLocalStorage<FilterQuery>("bcc-filters", {});
  // Get reactive data from atom
  const [showFilterMenu, setShowFilterMenu] = useAtom(showFilterAtom);
  const [filterQuery, setFilterQuery] = useAtom(filterQueryAtom);

  useEffect(() => {
    setFilterQuery(filters);
  }, [filters, setFilterQuery]);

  const closeFilters = () => setShowFilterMenu(false);
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

      <FiltersPanel
        data={makeFilterData([])}
        isShowing={showFilterMenu}
        closeHandler={closeFilters}
      />
    </>
  )
}