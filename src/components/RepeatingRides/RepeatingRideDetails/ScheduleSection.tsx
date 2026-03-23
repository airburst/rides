import { Row } from "@/components/Row";
import { type RepeatingRide } from "@/types";
import { formatDate, formatTime } from "@utils/dates";
import { getNextOccurrence } from "@utils/repeatingRides";
import { memo, useEffect, useState } from "react";

type ScheduleSectionProps = {
  ride: RepeatingRide;
};

export const ScheduleSection = memo(({ ride }: ScheduleSectionProps) => {
  const { startDate, winterStartTime, endDate, textRule } = ride;
  const time = formatTime(startDate);
  const [nextRun, setNextRun] = useState<string | null>(null);

  useEffect(() => {
    void getNextOccurrence(ride).then(setNextRun);
  }, [ride]);

  return (
    <div className="flex w-full flex-col gap-2 rounded lg:px-2 bg-white py-2 lg:py-4 shadow-md">
      <div className="px-2 text-xl font-bold tracking-wide text-neutral-700">
        Schedule
      </div>
      {textRule && (
        <Row>
          <div className="col-span-2 whitespace-pre-line">
            &quot;{textRule}&quot;
          </div>
        </Row>
      )}
      <Row>
        <div>Start time</div>
        <div>{time}</div>
      </Row>
      <Row>
        <div>Winter</div>
        <div>{winterStartTime}</div>
      </Row>
      <Row>
        <div>Next run</div>
        <div>{nextRun ? formatDate(nextRun) : "—"}</div>
      </Row>
      {endDate && (
        <Row>
          <div>End date</div>
          <div>{formatDate(endDate)}</div>
        </Row>
      )}
    </div>
  );
});

ScheduleSection.displayName = "ScheduleSection";
