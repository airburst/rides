import Link from "next/link";
import { getNow } from "../../../shared/utils";
import { type RideList } from "../../types";
import { RoundBadge } from "../Badge";

type Props = {
  day: number;
  date: string;
  past?: boolean;
  rides?: RideList[];
  classes?: string;
};

const getBadgeStyle = (
  past: boolean | undefined,
): string => {
  if (past) {
    return "past";
  }
  return "ready";
};

export const Day = ({ day, date, rides = [], classes, past }: Props) => {
  const today = getNow();
  const isToday = today.startsWith(date);

  const cellStyle = isToday
    ? "bg-base-300 text-black"
    : "bg-white hover:bg-base-300 cursor-pointer text-neutral-700";

  const wrapperClasses =
    classes ??
    `flex flex-col lg:text-md h-full mb-0 p-1 md:p-2 text-sm overflow-hidden min-h-0 min-w-0 ${cellStyle}`;

  const Content = (
    <div className={wrapperClasses}>
      <span className="text-md md:text-lg">{day}</span>
      {/* Mobile layout */}
      <div className="flex grow justify-center items-center pb-4">
        {rides && rides.length > 0 && (
          <RoundBadge
            text={rides.length}
            style={getBadgeStyle(past)}
          />
        )}
      </div>
    </div>
  );

  return <Link href={`/rides/${date}`}>{Content}</Link>;
};

export const OutsideDay = (props: Props) => (
  <Day
    {...props}
    classes="flex flex-col lg:text-md h-full w-full justify-center bg-base-200 p-1 md:p-2 mb-0 text-sm cursor-pointer text-neutral-700"
    past
  />
);
