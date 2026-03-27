import { Row } from "@/components/Row";
import { type RepeatingRide } from "@/types";
import { lazy, memo } from "react";

const Viewer = lazy(() => import("@/components/Markdown/Viewer"));

type RideInfoSectionProps = {
  ride: RepeatingRide;
};

export const RideInfoSection = memo(({ ride }: RideInfoSectionProps) => {
  const {
    name,
    rideGroup,
    meetPoint,
    destination,
    distance,
    leader,
    rideLimit,
    route,
    notes,
  } = ride;

  return (
    <>
      <div className="relative flex w-full flex-col gap-2 rounded bg-white lg:px-2 py-2 lg:py-4">
        <Row>
          <div>Name</div>
          <div className="truncate text-xl font-bold tracking-wide text-neutral-700">
            {name}
          </div>
        </Row>
        {rideGroup && (
          <Row>
            <div>Group</div>
            <div className="min-w-0">{rideGroup}</div>
          </Row>
        )}
        {meetPoint && (
          <Row>
            <div>Meet at</div>
            <div className="min-w-0">{meetPoint}</div>
          </Row>
        )}
        {destination && (
          <Row>
            <div>Destination</div>
            <div className="min-w-0">{destination}</div>
          </Row>
        )}
        {distance && (
          <Row>
            <div>Distance</div>
            <div>{distance}</div>
          </Row>
        )}
        {leader && (
          <Row>
            <div>Leader</div>
            <div>{leader}</div>
          </Row>
        )}
        {rideLimit && rideLimit > -1 && (
          <Row>
            <div>Limit</div>
            <div>{rideLimit}</div>
          </Row>
        )}
        {route && (
          <Row>
            <a
              className="text-primary hover:text-primary-focus col-span-2 underline"
              href={route}
              target="_blank"
              rel="noreferrer"
            >
              Click to see route
            </a>
          </Row>
        )}
      </div>

      {notes && <Viewer markdown={notes} title="Notes" />}
    </>
  );
});

RideInfoSection.displayName = "RideInfoSection";
