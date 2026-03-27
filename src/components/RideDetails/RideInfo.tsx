import Viewer from "@/components/Markdown/Viewer";
import { makeClickableUrl } from "@utils/makeClickableUrl";
import { formatDistance } from "@utils/rides";
import { Calendar, Clock, Map, Ruler, UserRound } from "lucide-react";
import { type Ride, type User } from "../../types";
import { CancelledBanner } from "./Cancelled";
import { Messages } from "./Messages";

type Props = {
  ride: Ride;
  user?: User;
};

export const RideInfo = ({ ride, user }: Props) => {
  const {
    name,
    rideGroup,
    day,
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
  const formattedDistance = formatDistance(
    distance ?? 0,
    user?.preferences?.units ?? "km",
  );

  const riderNotes = users
    ?.filter(({ notes }) => notes)
    .map(({ user, notes }) => ({
      name: user.name,
      image: user.image,
      rideNotes: makeClickableUrl(notes ?? ""),
    }));

  const locationText = [meetPoint, destination].filter(Boolean).join(" → ");
  const titleClass = rideGroup ? "grid-cols-[1fr_auto]" : "grid-cols-1";

  return (
    <div className="flex w-full flex-col gap-2 lg:gap-4 px-2 sm:px-0">
      {cancelled && <CancelledBanner />}
      <div className="relative flex w-full flex-col gap-2 rounded bg-white p-4">
        {/* Title: name + group */}
        <div className={`grid ${titleClass} gap-2`}>
          <h1 className="text-xl font-bold tracking-wide text-neutral-700">
            {name}
          </h1>
          {rideGroup && (
            <div className="flex justify-self-end lg:justify-self-start bg-primary/10 rounded-full px-2 text-sm items-center justify-center truncate max-h-8">
              {rideGroup}
            </div>
          )}
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-2 text-neutral-600">
          {/* Location — spans full width */}
          {locationText && (
            <div className="col-span-2 flex items-center gap-2">
              <span>{locationText}</span>
            </div>
          )}

          {/* Date + time */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-neutral-400" />
            <span className="font-bold">{time}</span>
          </div>
          <div className="flex items-center gap-2 justify-self-end lg:justify-self-start">
            <Calendar className="h-4 w-4 shrink-0 text-neutral-400" />
            <span>{day}</span>
          </div>

          {/* Distance + leader */}
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 shrink-0 text-neutral-400" />
            <span className="font-bold">{formattedDistance}</span>
          </div>
          {leader && (
            <div className="flex items-center gap-2 justify-self-end lg:justify-self-start">
              <UserRound className="h-4 w-4 shrink-0 text-neutral-400" />
              <span>{leader}</span>
            </div>
          )}
        </div>

        {/* Route CTA */}
        {route && (
          <a
            className="lg:max-w-64 flex items-center justify-center gap-2 rounded-lg border border-primary px-4 py-3 font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
            href={route}
            target="_blank"
            rel="noreferrer"
          >
            <Map className="h-5 w-5" />
            View Route
          </a>
        )}
      </div>

      {!cancelled && notes && <Viewer markdown={notes} title="Notes" />}

      {!cancelled && <Messages riderNotes={riderNotes} />}
    </div>
  );
};
