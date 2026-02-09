import { Row } from "@/components/Row";
import { type RepeatingRide } from "@/types";
import { formatDate, formatTime } from "@utils/dates";
import { memo } from "react";

type ScheduleSectionProps = {
  ride: RepeatingRide;
};

export const ScheduleSection = memo(({ ride }: ScheduleSectionProps) => {
  const { startDate, winterStartTime, endDate, textRule } = ride;
  const time = formatTime(startDate);

  return (
    <div className="flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
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
        <div>{formatDate(startDate)}</div>
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
