import { useCancelRide, useDeleteRide, useRide } from "@/hooks/useRides";
import { useSession } from "@/hooks/useSession";
import { useLocation, useParams, useRouter } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { flattenQuery } from "shared/utils";
import { toast } from "sonner";
import { Confirm } from "../Confirm";
import { MenuContent } from "./MenuContent";

const UserMenu = () => {
  const { session, isAuthenticated, login, logout } = useSession();
  const role = session?.user?.role;
  const router = useRouter();
  const { pathname } = useLocation();
  const params = useParams({ strict: false });
  const rideId = flattenQuery(
    (params as Record<string, string | undefined>).id,
  );

  // Derive rideId or repeatingRideId from the pathname
  const isRepeatingRidePage = pathname.includes("repeating");
  const isProfilePage = pathname.includes("profile");
  const repeatingRideId = isRepeatingRidePage ? rideId : undefined;

  // Fetch ride data to check if cancelled (only for regular ride pages)
  const { data: ride } = useRide(
    !isRepeatingRidePage && !isProfilePage && rideId ? rideId : "",
  );
  const isCancelled = ride?.cancelled ?? false;

  // Mutations
  const cancelMutation = useCancelRide();
  const deleteMutation = useDeleteRide();

  const [show, setShow] = useState<boolean>(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  const closeMenu = () => {
    setShow(false);
    setShowConfirmCancel(false);
    setShowConfirmDelete(false);
  };

  const toggleMenu = () => {
    setShow(!show);
    if (show) {
      setShowConfirmCancel(false);
      setShowConfirmDelete(false);
    }
  };

  const handleSignout = () => {
    logout();
    closeMenu();
  };

  const handleSignin = () => {
    void login();
    closeMenu();
  };

  const handleCancel = (cb: (flag: boolean) => void) => {
    if (!rideId) return cb(false);

    cancelMutation.mutate(rideId, {
      onSuccess: () => {
        router.history.back();
        toast.success("Ride has been cancelled.");
        closeMenu();
        cb(true);
      },
      onError: () => {
        toast.error("Failed to cancel ride.");
        cb(false);
      },
    });
  };

  const handleDelete = (cb: (flag: boolean) => void) => {
    if (!rideId) return cb(false);

    deleteMutation.mutate(rideId, {
      onSuccess: () => {
        router.history.back();
        toast.success("Ride has been deleted.");
        closeMenu();
        cb(true);
      },
      onError: () => {
        toast.error("Failed to delete ride.");
        cb(false);
      },
    });
  };

  const confirmCancel = () => {
    setShowConfirmCancel(true);
    setShow(false);
  };
  const confirmDelete = () => {
    setShowConfirmDelete(true);
    setShow(false);
  };

  return (
    <>
      <div className="drawer-auto-gutter drawer drawer-end">
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={show}
          readOnly
        />
        <div className="drawer-content">
          <div className="rounded p-1 text-3xl">
            <button
              type="button"
              onClick={toggleMenu}
              onKeyDown={toggleMenu}
              aria-label="open menu"
              className="cursor-pointer"
            >
              <Menu className="h-8 w-8 fill-white" />
            </button>
          </div>
        </div>

        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
            onClick={closeMenu}
          ></label>
          <MenuContent
            role={role}
            isAuthenticated={isAuthenticated}
            closeMenu={closeMenu}
            handleSignin={handleSignin}
            handleSignout={handleSignout}
            confirmCancel={confirmCancel}
            confirmDelete={confirmDelete}
            rideId={rideId}
            repeatingRideId={repeatingRideId}
            isCancelled={isCancelled}
          />
        </div>
      </div>

      <Confirm
        open={showConfirmCancel}
        closeHandler={closeMenu}
        heading="Are you sure you want to CANCEL this ride?  You cannot undo this action."
        onYes={(callback) => handleCancel(callback)}
      />

      <Confirm
        open={showConfirmDelete}
        closeHandler={closeMenu}
        heading="Are you sure you want to delete this ride?"
        onYes={(callback) => handleDelete(callback)}
      />
    </>
  );
};

export default UserMenu;
