/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { cancelRide } from "@/server/actions/cancel-ride";
import { deleteRide } from "@/server/actions/delete-ride";
import { type Role } from "@/types";
import { signIn, signOut } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { flattenQuery } from "shared/utils";
import { toast } from "sonner";
import { Confirm } from "../Confirm";
import { BarsIcon } from "../Icon";
import { MenuContent } from "./MenuContent";

type MenuProps = {
  role?: Role;
  isAuthenticated: boolean;
};

export const UserMenu = ({ role, isAuthenticated }: MenuProps) => {
  const router = useRouter();
  const params = useParams();
  const rideId = flattenQuery(params.id);
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


  const handleSignout = async () => {
    await signOut({ callbackUrl: "http://localhost:3000" });
    closeMenu();
  };

  const handleSignin = async () => {
    await signIn("auth0");
    closeMenu();
  };

  const handleCancel = async (cb: (flag: boolean) => void) => {
    const results = await cancelRide(rideId);

    if (results.success) {
      toast.success("Ride has been cancelled.")
      closeMenu();
      router.back();
      cb(true);
    } else {
      cb(false);
    }
  };

  const handleDelete = async (cb: (flag: boolean) => void) => {
    const results = await deleteRide(rideId);

    if (results.success) {
      toast.success("Ride has been deleted.")
      closeMenu();
      router.back();
      cb(true);
    } else {
      cb(false);
    }
  };

  const confirmCancel = () => {
    setShowConfirmCancel(true);
    setShow(false)
  }
  const confirmDelete = () => {
    setShowConfirmDelete(true);
    setShow(false)
  }

  return (
    <>
      <div className="drawer drawer-end drawer-auto-gutter">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" checked={show} readOnly />
        <div className="drawer-content">
          <div className="h-10 cursor-pointer rounded p-1 text-3xl">
            <button
              type="button"
              onClick={toggleMenu}
              onKeyDown={toggleMenu}
              aria-label="open menu">
              <BarsIcon className="fill-white w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="drawer-side">
          <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay" onClick={closeMenu}></label>
          <MenuContent
            role={role}
            isAuthenticated={isAuthenticated}
            closeMenu={closeMenu}
            handleSignin={handleSignin}
            handleSignout={handleSignout}
            confirmCancel={confirmCancel}
            confirmDelete={confirmDelete}
            rideId={rideId}
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
