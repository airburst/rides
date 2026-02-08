import { useAuth0 } from "@auth0/auth0-react";
import { type User } from "../../types";
import { RiderDetails } from "./RiderDetails";

type Props = {
  user?: User;
  users?: User[];
  isLeader: boolean;
  hasRiders?: boolean;
  rideNotes?: string;
};

export const RidersGoing = ({
  user,
  users,
  hasRiders,
  isLeader,
  rideNotes,
}: Props) => {
  const { loginWithRedirect } = useAuth0();

  if (!hasRiders) {
    return null;
  }

  const handleSignIn = () => void loginWithRedirect();

  return (
    <div className="flex w-full px-2 sm:px-0">
      <div className="flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
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
          <div className="flex flex-col gap-2 px-2">
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
