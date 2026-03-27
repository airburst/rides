import { useAuth0 } from "@auth0/auth0-react";
import { type User } from "../../types";
import { Badge } from "../Badge";
import { RiderDetails } from "./RiderDetails";

type Props = {
  user?: User;
  users?: User[];
  isLeader: boolean;
  hasRiders?: boolean;
  rideNotes?: string;
  ridersLabel?: string | number;
};

export const RidersGoing = ({
  user,
  users,
  hasRiders,
  isLeader,
  rideNotes,
  ridersLabel,
}: Props) => {
  const { loginWithRedirect } = useAuth0();

  if (!hasRiders) {
    return null;
  }

  const handleSignIn = () => void loginWithRedirect();

  return (
    <div className="flex w-full px-2 sm:px-0">
      <div className="flex w-full flex-col gap-2 rounded bg-white p-4">
        <div className="flex items-center gap-4 text-xl font-bold tracking-wide text-neutral-700">
          Going
          {ridersLabel !== undefined && (
            <Badge text={ridersLabel} className="px-3 text-sm" />
          )}
        </div>
        {user ? (
          users?.map((u) => (
            <RiderDetails
              key={u.id}
              user={u}
              isLeader={isLeader}
              sessionUser={user?.id}
            />
          ))
        ) : (
          <div className="flex flex-col gap-2">
            {rideNotes && <div>Note: {rideNotes}</div>}
            <div>
              Please{" "}
              <button
                className="underline cursor-pointer text-primary"
                type="button"
                aria-label="Click to log in"
                onClick={handleSignIn}
              >
                log in
              </button>{" "}
              to see other rider details and join rides.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
