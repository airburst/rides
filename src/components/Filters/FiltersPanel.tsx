import { DEFAULT_WEEKS_TO_SHOW } from "@/constants";
import { useFilter } from "@/contexts/FilterContext";
import clsx from "clsx";
import { Check, ChevronDown, X } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { Button } from "../Button";

type Props = {
  isShowing: boolean;
  closeHandler: () => void;
  data: (string | null | undefined)[];
};

export const FiltersPanel = ({ isShowing, closeHandler, data }: Props) => {
  const ref = useRef<HTMLElement>(null!);
  const { filterQuery, setFilterQuery } = useFilter();
  const [onlyJoined, setOnlyJoined] = useState<boolean>(
    filterQuery.onlyJoined ?? false,
  );
  const [search, setSearch] = useState<string>(filterQuery.q ?? "");
  const [weeksAhead, setWeeksAhead] = useState<string>(
    filterQuery.weeksAhead ?? DEFAULT_WEEKS_TO_SHOW,
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSwitchChange = () => {
    setOnlyJoined(!onlyJoined);
    setFilterQuery({
      ...filterQuery,
      onlyJoined: !filterQuery.onlyJoined,
    });
  };
  const switchClass = clsx(
    "relative inline-flex h-6 w-11 items-center rounded-full",
    onlyJoined ? "bg-green-600" : "bg-gray-200",
  );
  const toggleClass = clsx(
    "inline-block h-4 w-4 transform rounded-full bg-white transition",
    onlyJoined ? "translate-x-6" : "translate-x-1",
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowDropdown(true);
  };

  const handleWeeksChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setWeeksAhead(val);
    setFilterQuery({ ...filterQuery, weeksAhead: val });
  };

  const handleSelected = (query: string | null) => {
    const q = query ?? "";
    setFilterQuery({ ...filterQuery, q });
    setSearch(q);
    setShowDropdown(false);
  };

  const reset = () => {
    setOnlyJoined(false);
    setSearch("");
    setWeeksAhead(DEFAULT_WEEKS_TO_SHOW);
    setFilterQuery({
      onlyJoined: false,
      weeksAhead: DEFAULT_WEEKS_TO_SHOW,
    });
  };

  const filteredData =
    search === ""
      ? data
      : data.filter((item) =>
          (item ?? "")
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(search.toLowerCase().replace(/\s+/g, "")),
        );

  useOnClickOutside(ref, closeHandler);

  if (!isShowing) return null;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="fixed top-0 left-0 z-30 h-82 w-full animate-slide-down bg-neutral-800 text-white shadow-xl"
    >
      <div className="container mx-auto flex w-full flex-col p-4 md:px-4 lg:max-w-[1024px]">
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
          <div className="relative z-20 mt-1">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus-within:ring-2 focus-within:ring-white focus-within:ring-offset-2 focus-within:ring-offset-teal-300 sm:text-sm">
              <input
                className="w-full border-none py-2 pr-10 pl-3 leading-5 text-gray-700 focus:ring-0 focus:outline-none"
                placeholder="Search ride details"
                value={search}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <ChevronDown className="h-4 w-4 fill-neutral-700" />
              </button>
            </div>
            {showDropdown && filteredData.length > 0 && (
              <div className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
                {filteredData.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="relative w-full cursor-default py-2 pr-4 pl-10 text-left text-gray-900 select-none hover:bg-teal-600 hover:text-white"
                    onClick={() => handleSelected(item ?? "")}
                  >
                    <span
                      className={`block truncate ${
                        search === item ? "font-medium" : "font-normal"
                      }`}
                    >
                      {item}
                    </span>
                    {search === item && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600">
                        <Check className="h-5 w-5" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            {showDropdown &&
              filteredData.length === 0 &&
              search !== "" && (
                <div className="absolute mt-1 w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5">
                  <div className="relative cursor-default px-4 py-2 text-gray-700 select-none">
                    Nothing found.
                  </div>
                </div>
              )}
          </div>
        </div>

        <div className="mt-4 flex flex-row justify-between">
          <div>Only show my rides</div>
          <button
            type="button"
            role="switch"
            aria-checked={onlyJoined}
            onClick={handleSwitchChange}
            className={switchClass}
          >
            <span className="sr-only">Only show my rides</span>
            <span className={toggleClass} />
          </button>
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
