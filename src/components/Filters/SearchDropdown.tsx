import { Check, ChevronDown } from "lucide-react";
import { memo, type ChangeEvent } from "react";

type SearchDropdownProps = {
  search: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  showDropdown: boolean;
  toggleDropdown: () => void;
  filteredData: (string | null | undefined)[];
  onSelect: (query: string | null) => void;
};

export const SearchDropdown = memo(
  ({
    search,
    onSearchChange,
    onFocus,
    showDropdown,
    toggleDropdown,
    filteredData,
    onSelect,
  }: SearchDropdownProps) => {
    return (
      <div className="relative z-20 mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus-within:ring-2 focus-within:ring-white focus-within:ring-offset-2 focus-within:ring-offset-teal-300 sm:text-sm">
          <input
            className="w-full border-none py-2 pr-10 pl-3 leading-5 text-gray-700 focus:ring-0 focus:outline-none"
            placeholder="Search ride details"
            value={search}
            onChange={onSearchChange}
            onFocus={onFocus}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700"
            onClick={toggleDropdown}
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
                onClick={() => onSelect(item ?? "")}
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
        {showDropdown && filteredData.length === 0 && search !== "" && (
          <div className="absolute mt-1 w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5">
            <div className="relative cursor-default px-4 py-2 text-gray-700 select-none">
              Nothing found.
            </div>
          </div>
        )}
      </div>
    );
  },
);

SearchDropdown.displayName = "SearchDropdown";
