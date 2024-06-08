import { signIn } from "next-auth/react";
import { User } from "../../types";
import { RiderDetails } from "./RiderDetails";

type Props = {
  user?: User;
  users?: User[];
  isLeader: boolean;
  hasRiders?: boolean;
  rideNotes?: string;
};

const handleSignIn = () => signIn("auth0");

export const RidersGoing = ({
  user,
  users,
  hasRiders,
  isLeader,
  rideNotes,
}: Props) => {
  if (!hasRiders) {
    return null;
  }

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
