import { makeClickableUrl } from "@utils/makeClickableUrl";
import { type Ride } from "../../types";
import { Viewer } from "../Markdown/Viewer";
import { CancelledBanner } from "./Cancelled";
import { Messages } from "./Messages";
import { Row } from "./Row";

type Props = {
  ride: Ride;
};

export const RideInfo = ({ ride }: Props) => {
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

  const riderNotes = users?.filter(({ notes }) => notes)
    .map(({ user, notes }) => ({
      name: user.name,
      image: user.image,
      rideNotes: makeClickableUrl(notes ?? ""),
    }));

  return (
    <div className="flex w-full flex-col gap-2 px-2 sm:px-0">
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

      {cancelled && (<CancelledBanner />)}

      {!cancelled && notes && (
        <Viewer markdown={notes} title="Notes" />
      )}

      {!cancelled && <Messages riderNotes={riderNotes} />}
    </div>
  );
};
