"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type FilterContextType = {
  showFilterMenu: boolean;
  setShowFilterMenu: (show: boolean) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  return (
    <FilterContext.Provider value={{ showFilterMenu, setShowFilterMenu }}>
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
