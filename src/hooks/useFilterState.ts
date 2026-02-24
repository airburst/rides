import { DEFAULT_WEEKS_TO_SHOW } from "@/constants";
import { useCallback, useState } from "react";
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

  const handleSwitchChange = useCallback(() => {
    const newValue = !onlyJoined;
    setOnlyJoined(newValue);
    setFilterQuery({
      ...initialFilterQuery,
      onlyJoined: newValue,
    });
  }, [onlyJoined, initialFilterQuery, setFilterQuery]);

  const handleWeeksChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      setWeeksAhead(val);
      setFilterQuery({ ...initialFilterQuery, weeksAhead: val });
    },
    [initialFilterQuery, setFilterQuery],
  );

  const handleSelected = useCallback(
    (query: string) => {
      setFilterQuery({ ...initialFilterQuery, q: query });
      setSearch(query);
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

  return {
    onlyJoined,
    search,
    weeksAhead,
    handleSwitchChange,
    handleWeeksChange,
    handleSelected,
    reset,
  };
};
