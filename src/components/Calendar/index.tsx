import {
  daysInMonth,
  firstDayOfMonth,
  getLastMonth,
  getNextMonth,
  getNow,
  mapRidesToDate,
} from "../../../shared/utils";
import { type RideList } from "../../types";
import { Day, OutsideDay } from "./Day";
import { HeadingGroup } from "./Heading";

type Props = {
  date: string;
  rides?: RideList[];
};

const getDateStub = (date: string) => {
  const parts = date.split("-");
  return `${parts[0]}-${parts[1]}`;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Calendar: React.FC<Props> = ({ rides, date }: Props) => {
  const today = getNow().split("T")[0] ?? "";
  const startDay = firstDayOfMonth(date);
  const lastDay = daysInMonth(date);

  const calGrid = [];

  // If first day > 0 (Sunday) we need to include days from end of previous month
  if (startDay > 0) {
    const lastMonth = getLastMonth(date);
    const endOfLastMonth = daysInMonth(lastMonth);

    for (let pd = 0; pd < startDay; pd += 1) {
      const day = endOfLastMonth - startDay + pd + 1;
      const calDate = `${getDateStub(lastMonth)}-${day
        .toString()
        .padStart(2, "0")}`;

      calGrid.push({
        type: calDate >= today ? "future" : "historic",
        day,
        date: calDate,
      });
    }
  }

  // Add all of the days in month
  for (let d = 1; d < lastDay + 1; d += 1) {
    const calDate = `${getDateStub(date)}-${d.toString().padStart(2, "0")}`;

    calGrid.push({
      type: calDate >= today ? "future" : "historic",
      day: d,
      date: calDate,
    });
  }

  // Fill up final week with next month
  const remainder = calGrid.length % 7;

  if (remainder > 0) {
    const nextMonth = getNextMonth(date);

    for (let nd = 1; nd < 8 - remainder; nd += 1) {
      const calDate = `${getDateStub(nextMonth)}-${nd
        .toString()
        .padStart(2, "0")}`;

      calGrid.push({
        type: calDate >= today ? "future" : "historic",
        day: nd,
        date: calDate,
      });
    }
  }

  const rowCount = calGrid.length / 7;

  // Match rides to dates
  const daysWithRides = calGrid.map((dt) => ({
    ...dt,
    rides: mapRidesToDate(rides ?? [], dt.date),
  }));

  const loading = false; // FIXME: Add suspense

  return loading ? (
    <div className={`grid grid-cols-7 grid-rows-${rowCount} gap-0 bg-white shadow-md sm:m-2 lg:m-0`}>
      <HeadingGroup />
      {calGrid.map(({ type, day, date: calDate }) =>
        type === "historic" ? (
          <OutsideDay key={`historic-${calDate}`} day={day} date={calDate} />
        ) : (
          <Day key={`cal-${calDate}`} day={day} date={calDate} />
        )
      )}
    </div>
  ) : (
    <>
      <div className={`grid grid-cols-7 gap-0 bg-white shadow-md lg:m-0`}>
        <HeadingGroup />
      </div>
      <div className={`grid grid-cols-7 grid-rows-${rowCount} gap-0 bg-white shadow-md lg:m-0`} >
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
