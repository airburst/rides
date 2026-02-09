import { useFilter } from "@/contexts/FilterContext";
import { useFilterState } from "@/hooks/useFilterState";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { X } from "lucide-react";
import { useCallback, useMemo, useRef } from "react";
import { Button } from "../Button";
import { ToggleSwitch } from "../ToggleSwitch";
import { SearchDropdown } from "./SearchDropdown";

type Props = {
  isShowing: boolean;
  closeHandler: () => void;
  data: (string | null | undefined)[];
};

export const FiltersPanel = ({ isShowing, closeHandler, data }: Props) => {
  const ref = useRef<HTMLElement>(null!);
  const { filterQuery, setFilterQuery } = useFilter();

  const {
    onlyJoined,
    search,
    weeksAhead,
    showDropdown,
    handleSwitchChange,
    handleSearchChange,
    handleWeeksChange,
    handleSelected,
    reset,
    filterData,
    setShowDropdown,
  } = useFilterState(filterQuery, setFilterQuery);

  const filteredData = useMemo(() => filterData(data), [filterData, data]);

  const toggleDropdown = useCallback(
    () => setShowDropdown(!showDropdown),
    [showDropdown, setShowDropdown],
  );

  const handleFocus = useCallback(
    () => setShowDropdown(true),
    [setShowDropdown],
  );

  useOnClickOutside(ref, closeHandler);

  if (!isShowing) return null;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="fixed top-0 left-0 z-30 h-82 w-full animate-slide-down bg-neutral-800 text-white shadow-xl"
    >
      <div className="container mx-auto flex w-full flex-col p-4 md:px-4 lg:max-w-5xl">
        <div className="flex flex-row justify-between">
          <div className="text-3xl">Filters</div>
          <button
            type="button"
            aria-label="Close filters"
            onClick={closeHandler}
            title="Close filters"
            className="flex items-center rounded p-1 text-3xl"
          >
            <X className="h-8 w-8 fill-white" />
          </button>
        </div>

        <div className="mt-2 flex flex-col gap-4 md:gap-8">
          <SearchDropdown
            search={search}
            onSearchChange={handleSearchChange}
            onFocus={handleFocus}
            showDropdown={showDropdown}
            toggleDropdown={toggleDropdown}
            filteredData={filteredData}
            onSelect={handleSelected}
          />
        </div>

        <div className="mt-4 flex flex-row justify-between">
          <div>Only show my rides</div>
          <ToggleSwitch
            checked={onlyJoined}
            onChange={handleSwitchChange}
            label="Only show my rides"
            srOnlyLabel
          />
        </div>

        <div className="mt-4 flex flex-row items-center justify-between">
          <div>Weeks ahead</div>
          <label htmlFor="weeks" className="flex w-32 flex-col gap-1">
            <select
              id="weeks"
              aria-label="Weeks ahead"
              className="rounded-md text-neutral-700"
              value={weeksAhead}
              onChange={handleWeeksChange}
            >
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="6">6</option>
              <option value="8">8</option>
              <option value="-1">Forever</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-row justify-end gap-4">
          <Button onClick={reset} title="Reset filters">
            <span>RESET</span>
          </Button>
          <Button
            secondary
            onClick={closeHandler}
            title="apply and close filter menu"
          >
            <span>APPLY</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
