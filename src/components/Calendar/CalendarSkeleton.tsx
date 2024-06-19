import { generateCalendar } from "@utils/calendar";
import {
  flattenQuery,
  getNow
} from "../../../shared/utils";
import { Day, OutsideDay } from "./Day";
import { HeadingGroup } from "./Heading";

type Props = {
  date: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CalendarSkeleton: React.FC<Props> = async ({ date }: Props) => {
  const monthDate = date ? flattenQuery(date) : getNow();
  const calGrid = generateCalendar(monthDate);
  const rowCount = calGrid.length / 7;

  return (
    <>
      <div className={`grid grid-cols-7 gap-0`}>
        <HeadingGroup />
      </div>

      <div className={`h-full grid grid-cols-7 grid-rows-${rowCount} gap-[1px] bg-base-300`} >
        {calGrid.map(({ type, day, date: calDate }) =>
          type === "historic" ? (
            <OutsideDay
              key={`historic-${calDate}`}
              day={day}
              date={calDate}
            />
          ) : (
            <Day
              key={`cal-${calDate}`}
              day={day}
              date={calDate}
            />
          )
        )}
      </div >
    </>
  );
};
