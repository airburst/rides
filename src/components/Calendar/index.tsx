import { getRides } from "@/server/actions/getRides";
import { generateCalendar } from "@utils/calendar";
import {
  flattenQuery,
  getMonthDateRange,
  getNow,
  mapRidesToDate
} from "../../../shared/utils";
import { type RideList } from "../../types";
import { MainContent } from "../Layout/MainContent";
import { Day, OutsideDay } from "./Day";
import { HeadingGroup } from "./Heading";

type Props = {
  date: string;
  rides?: RideList[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Calendar: React.FC<Props> = async ({ date }: Props) => {
  const monthDate = date ? flattenQuery(date) : getNow();
  const { start, end } = getMonthDateRange(monthDate);
  const calGrid = generateCalendar(monthDate);
  const rowCount = calGrid.length / 7;

  // Fetch rides for month
  const { rides, error } = await getRides(start, end);

  if (error) {
    return <MainContent>
      <div>{error.message}</div>
    </MainContent>
  }

  // Match rides to dates
  const daysWithRides = calGrid.map((dt) => ({
    ...dt,
    rides: mapRidesToDate(rides ?? [], dt.date),
  }));

  return (
    <>
      <div className={`grid grid-cols-7 gap-0`}>
        <HeadingGroup />
      </div>

      <div className={`h-full grid grid-cols-7 grid-rows-${rowCount} auto-rows-fr gap-[1px] bg-base-300`} >
        {daysWithRides.map(({ type, day, rides: mappedRides, date: calDate }) =>
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
          )
        )}
      </div >
    </>
  );
};
