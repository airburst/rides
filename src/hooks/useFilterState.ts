import { DEFAULT_WEEKS_TO_SHOW } from "@/constants";
import { useCallback, useMemo, useState } from "react";
import type { ChangeEvent } from "react";

type FilterQuery = {
  onlyJoined?: boolean;
  q?: string;
  weeksAhead?: string;
};

export const useFilterState = (
  initialFilterQuery: FilterQuery,
  setFilterQuery: (query: FilterQuery) => void,
) => {
  const [onlyJoined, setOnlyJoined] = useState<boolean>(
    initialFilterQuery.onlyJoined ?? false,
  );
  const [search, setSearch] = useState<string>(initialFilterQuery.q ?? "");
  const [weeksAhead, setWeeksAhead] = useState<string>(
    initialFilterQuery.weeksAhead ?? DEFAULT_WEEKS_TO_SHOW,
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSwitchChange = useCallback(() => {
    const newValue = !onlyJoined;
    setOnlyJoined(newValue);
    setFilterQuery({
      ...initialFilterQuery,
      onlyJoined: newValue,
    });
  }, [onlyJoined, initialFilterQuery, setFilterQuery]);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowDropdown(true);
  }, []);

  const handleWeeksChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      setWeeksAhead(val);
      setFilterQuery({ ...initialFilterQuery, weeksAhead: val });
    },
    [initialFilterQuery, setFilterQuery],
  );

  const handleSelected = useCallback(
    (query: string | null) => {
      const q = query ?? "";
      setFilterQuery({ ...initialFilterQuery, q });
      setSearch(q);
      setShowDropdown(false);
    },
    [initialFilterQuery, setFilterQuery],
  );

  const reset = useCallback(() => {
    setOnlyJoined(false);
    setSearch("");
    setWeeksAhead(DEFAULT_WEEKS_TO_SHOW);
    setFilterQuery({
      onlyJoined: false,
      weeksAhead: DEFAULT_WEEKS_TO_SHOW,
    });
  }, [setFilterQuery]);

  const filterData = useCallback(
    (data: (string | null | undefined)[]) =>
      search === ""
        ? data
        : data.filter((item) =>
            (item ?? "")
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(search.toLowerCase().replace(/\s+/g, "")),
          ),
    [search],
  );

  return {
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
  };
};
