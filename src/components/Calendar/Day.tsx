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

// TODO: fix last-child borders
export const Day = ({ day, date, rides = [], classes, past }: Props) => {
  const today = getNow();
  const isToday = today.startsWith(date);

  const cellStyle = isToday
    ? "bg-base-300 text-black"
    : "bg-white hover:bg-base-300 cursor-pointer";

  const wrapperClasses =
    classes ??
    `flex flex-col lg:text-md h-full mb-0 p-1 text-sm overflow-hidden min-h-0 min-w-0 ${cellStyle}`;

  const Content = (
    <div className={wrapperClasses}>
      {day}

      {/* Mobile layout */}
      <div className="flex grow justify-center items-center pb-4">
        {rides && rides.length > 0 && (
          <RoundBadge
            text={rides.length}
            style={getBadgeStyle(past)}
          />
        )}
      </div>

      {/* Larger viewports */}
      {/* <div className="hidden sm:flex-1 sm:visible sm:grid sm:grid-cols-3 sm:gap-1">
        {rides?.map((ride) => (
          <div key={ride.id} className="truncate">
            <Badge
              text={formatRideBadge(ride)}
              style={getBadgeStyle(past)}
              small
            />
          </div>
        ))}
      </div> */}
    </div>
  );

  // Disable link for 'outside' days
  return <Link href={`/ride/planner/${date}`}>{Content}</Link>;
};

export const OutsideDay = (props: Props) => (
  <Day
    {...props}
    classes="lg:text-md h-full w-full justify-self-center bg-base-200 p-1 text-sm text-neutral-400 cursor-pointer"
    past
  />
);
