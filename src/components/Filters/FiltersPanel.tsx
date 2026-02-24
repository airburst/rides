import { NativeSelect } from "@/components/ui/native-select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useFilter } from "@/contexts/FilterContext";
import { useFilterState } from "@/hooks/useFilterState";
import { X } from "lucide-react";
import { useMemo } from "react";
import { ToggleSwitch } from "../ToggleSwitch";
import { SearchDropdown } from "./SearchDropdown";

type Props = {
  isShowing: boolean;
  closeHandler: () => void;
  data: (string | null | undefined)[];
};

export const FiltersPanel = ({ isShowing, closeHandler, data }: Props) => {
  const { filterQuery, setFilterQuery } = useFilter();

  const {
    onlyJoined,
    search,
    weeksAhead,
    handleSwitchChange,
    handleWeeksChange,
    handleSelected,
  } = useFilterState(filterQuery, setFilterQuery);

  const filteredData = useMemo(() => data.filter(Boolean), [data]);

  return (
    <Sheet open={isShowing} onOpenChange={(open) => !open && closeHandler()}>
      <SheetContent
        side="top"
        showCloseButton={false}
        className="bg-neutral-800 text-white shadow-xl"
      >
        <div className="container mx-auto flex w-full flex-col p-4 gap-4 md:px-4 lg:max-w-5xl">
          <div className="flex flex-row justify-between">
            <SheetTitle className="text-3xl font-light tracking-wide text-white">
              Filters
            </SheetTitle>
            <button
              type="button"
              aria-label="Close filters"
              onClick={closeHandler}
              title="Close filters"
              className="flex items-center rounded text-3xl"
            >
              <X className="h-8 w-8 fill-white" />
            </button>
          </div>

          <SearchDropdown
            value={search}
            onValueChange={handleSelected}
            data={filteredData}
          />

          <div className="flex flex-row items-center justify-between">
            <div>Only show my rides</div>
            <ToggleSwitch
              checked={onlyJoined}
              onCheckedChange={handleSwitchChange}
              label="Only show my rides"
            />
          </div>

          <div className="flex flex-row items-center justify-between">
            <div>Weeks ahead</div>
            <label htmlFor="weeks" className="flex w-32 flex-col gap-1">
              <NativeSelect
                id="weeks"
                aria-label="Weeks ahead"
                className="text-neutral-700"
                value={weeksAhead}
                onChange={handleWeeksChange}
              >
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="8">8</option>
                <option value="-1">Forever</option>
              </NativeSelect>
            </label>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
