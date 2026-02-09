import { useLocalStorage } from "@/hooks/useLocalStorage";
import { type FilterQuery } from "@/types";
import { createContext, useContext, useState, type ReactNode } from "react";

type FilterContextType = {
  showFilterMenu: boolean;
  setShowFilterMenu: (show: boolean) => void;
  filterQuery: FilterQuery;
  setFilterQuery: (query: FilterQuery) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [stored, persistFilters] = useLocalStorage<FilterQuery>(
    "bcc-filters",
    {},
  );
  const [filterQuery, _setFilterQuery] = useState<FilterQuery>(stored);

  const setFilterQuery = (query: FilterQuery) => {
    _setFilterQuery(query);
    persistFilters(query);
  };

  return (
    <FilterContext.Provider
      value={{ showFilterMenu, setShowFilterMenu, filterQuery, setFilterQuery }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within FilterProvider");
  }
  return context;
}
