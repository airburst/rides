"use client";

import { useCancelRide, useDeleteRide, useRide } from "@/hooks/useRides";
import { useSession } from "@/hooks/useSession";
import { Menu } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { flattenQuery } from "shared/utils";
import { toast } from "sonner";
import { Confirm } from "../Confirm";
import { MenuContent } from "./MenuContent";

const UserMenu = () => {
  const { session, isAuthenticated, login, logout } = useSession();
  const role = session?.user?.role;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const rideId = flattenQuery(params.id);

  // Fetch ride data to check if cancelled
  const { data: ride } = useRide(rideId || "");
  const isCancelled = ride?.cancelled ?? false;

  // Mutations
  const cancelMutation = useCancelRide();
  const deleteMutation = useDeleteRide();

  const [show, setShow] = useState<boolean>(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  // Derive rideId or repeatingRideId from the pathname
  const repeatingRideId = pathname.includes("repeating") ? rideId : undefined;

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
        router.back();
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
        router.back();
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
