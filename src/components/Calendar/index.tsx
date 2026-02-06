"use client";

import { useRides } from "@/hooks/rides";
import { generateCalendar } from "@utils/calendar";
import {
  flattenQuery,
  getMonthDateRange,
  getNow,
  mapRidesToDate,
} from "../../../shared/utils";
import { MainContent } from "../Layout/MainContent";
import { Day, OutsideDay } from "./Day";
import { HeadingGroup } from "./Heading";

export type CalendarProps = {
  date: string;
};

const Calendar: React.FC<CalendarProps> = ({ date }: CalendarProps) => {
  const monthDate = date ? flattenQuery(date) : getNow();
  const { start, end } = getMonthDateRange(monthDate);
  const calGrid = generateCalendar(monthDate);
  const rowCount = calGrid.length / 7;

  // Fetch rides for month
  const { data, isLoading, error } = useRides(start, end);

  if (isLoading) {
    return (
      <MainContent>
        <div className="flex h-64 w-full items-center justify-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      </MainContent>
    );
  }

  if (error) {
    return (
      <MainContent>
        <div>{error.message}</div>
      </MainContent>
    );
  }

  // Match rides to dates
  const daysWithRides = calGrid.map((dt) => ({
    ...dt,
    rides: mapRidesToDate(data ?? [], dt.date),
  }));

  return (
    <>
      <div className={`grid grid-cols-7 gap-0`}>
        <HeadingGroup />
      </div>

      <div
        className={`grid h-full grid-cols-7 grid-rows-${rowCount} auto-rows-fr gap-px bg-base-300`}
      >
        {daysWithRides.map(
          ({ type, day, rides: mappedRides, date: calDate }) =>
            type === "historic" ? (
              <OutsideDay
                key={`historic-${calDate}`}
                day={day}
                date={calDate}
                rides={mappedRides}
              />
            ) : (
              <Day
                key={`cal-${calDate}`}
                day={day}
                date={calDate}
                rides={mappedRides}
              />
            ),
        )}
      </div>
    </>
  );
};

export default Calendar;
