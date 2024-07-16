import { makeClickableUrl } from "@utils/makeClickableUrl";
import { formatDistance } from "@utils/rides";
import dynamic from "next/dynamic";
import { type Ride, type User } from "../../types";
import { CancelledBanner } from "./Cancelled";
import { Messages } from "./Messages";
import { Row } from "./Row";

const Viewer = dynamic(() => import("@/components/Markdown/Viewer"));
// const RideWithGpsMap = dynamic(() => import("@/components/RideWithGpsMap"));

type Props = {
  ride: Ride;
  user?: User;
};

export const RideInfo = ({ ride, user }: Props) => {
  const {
    name,
    rideGroup,
    time,
    meetPoint,
    destination,
    distance,
    leader,
    route,
    notes,
    cancelled,
    users,
  } = ride;
  const formattedDistance = formatDistance(distance ?? 0, user?.preferences?.units ?? "km");

  const riderNotes = users?.filter(({ notes }) => notes)
    .map(({ user, notes }) => ({
      name: user.name,
      image: user.image,
      rideNotes: makeClickableUrl(notes ?? ""),
    }));


  return (
    <div className="flex w-full flex-col gap-2 px-2 sm:px-0">
      {cancelled && (<CancelledBanner />)}
      <div className="relative flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
        <Row>
          <div className="text-xl font-bold tracking-wide text-neutral-700">
            {time}
          </div>
          <div className="text-xl font-bold tracking-wide text-neutral-700">
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
        <Row>
          <div>Distance</div>
          <div>{formattedDistance}</div>
        </Row>
        {leader && (
          <Row>
            <div>Leader</div>
            <div>{leader}</div>
          </Row>
        )}
        {route && (
          <Row>
            <a
              className="col-span-2 text-primary underline hover:text-primary-focus"
              href={route}
              target="_blank"
              rel="noreferrer"
            >
              Click to see route
            </a>
          </Row>
        )}
      </div>

      {/* <RideWithGpsMap url={route} units={user?.preferences?.units} /> */}

      {!cancelled && notes && (
        <Viewer markdown={notes} title="Notes" />
      )}

      {!cancelled && <Messages riderNotes={riderNotes} />}
    </div>
  );
};
