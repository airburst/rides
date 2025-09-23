"use client";

import type { Role } from "@/types";
import copy from "copy-to-clipboard";
import {
  Calendar,
  CircleAlert,
  Copy,
  Link,
  LogIn,
  LogOut,
  Pencil,
  Plus,
  Repeat,
  Settings,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { flattenQuery } from "shared/utils";
import pkg from "../../../package.json";
import { MenuEntry } from "./MenuEntry";

type MenuContentProps = {
  role?: Role;
  isAuthenticated: boolean;
  closeMenu: () => void;
  handleSignin: () => void;
  handleSignout: () => void;
  confirmCancel: () => void;
  confirmDelete: () => void;
  rideId?: string;
  repeatingRideId?: string;
  isCancelled?: boolean;
};

export const MenuContent = ({
  role,
  isAuthenticated,
  handleSignin,
  handleSignout,
  closeMenu,
  rideId,
  repeatingRideId,
  confirmCancel,
  confirmDelete,
  isCancelled,
}: MenuContentProps) => {
  const isLeader = role && ["ADMIN", "LEADER"].includes(role);
  const isAdmin = role === "ADMIN";

  const showEditAndDelete = isLeader && (repeatingRideId || rideId);
  const editRideUrl = repeatingRideId
    ? `/repeating-rides/edit/${repeatingRideId}`
    : `/ride/edit/${rideId}`;

  // Make a short url with last 6 characters of ride id
  const copyLink = () => {
    const path = window.location.href;
    const parts = path.split("/");
    const shortId = parts.pop()?.slice(-6);
    const url = [...parts.slice(0, 3), "r", shortId].join("/");
    copy(url);
    return true;
  };

  return (
    <div className="min-h-full w-80 bg-neutral-900 px-2 sm:w-96">
      <div className="flex h-16 flex-col items-end justify-center rounded text-3xl sm:h-24 sm:items-start sm:pl-2">
        <button
          type="button"
          onClick={closeMenu}
          onKeyDown={closeMenu}
          aria-label="open menu"
          className="w-full cursor-pointer"
        >
          <X className="h-8 w-8" />
        </button>
      </div>

      <ul className="menu text-base-300 p-0 text-xl">
        {!isAuthenticated && (
          <MenuEntry label="Log in" onClick={handleSignin}>
            <LogIn className="h-6 w-6" />
          </MenuEntry>
        )}

        <MenuEntry label="Calendar" href="/calendar" onClick={closeMenu}>
          <Calendar className="h-6 w-6" />
        </MenuEntry>

        {isLeader && (
          <MenuEntry label="Add Ride" href="/ride/new" onClick={closeMenu}>
            <Plus className="h-6 w-6" />
          </MenuEntry>
        )}

        {isLeader && rideId && (
          <MenuEntry
            label="Copy Ride"
            href={`/ride/copy/${flattenQuery(rideId)}`}
            onClick={closeMenu}
          >
            <Copy className="h-6 w-6" />
          </MenuEntry>
        )}

        {showEditAndDelete && (
          <>
            <MenuEntry label="Edit Ride" href={editRideUrl} onClick={closeMenu}>
              <Pencil className="h-6 w-6" />
            </MenuEntry>
            {!isCancelled && (
              <MenuEntry label="Cancel Ride" onClick={confirmCancel}>
                <CircleAlert className="h-6 w-6" />
              </MenuEntry>
            )}
            <MenuEntry label="Delete Ride" onClick={confirmDelete}>
              <Trash2 className="h-6 w-6" />
            </MenuEntry>
            <MenuEntry label="Copy Ride Link" onClick={copyLink}>
              <Link className="h-6 w-6" />
            </MenuEntry>
          </>
        )}

        {isAdmin && (
          <>
            <MenuEntry label="Manage Users" href="/users" onClick={closeMenu}>
              <Users className="h-6 w-6" />
            </MenuEntry>
            <MenuEntry
              label="Repeating Rides"
              href="/repeating-rides"
              onClick={closeMenu}
            >
              <Repeat className="h-6 w-6" />
            </MenuEntry>
          </>
        )}

        {isAuthenticated && (
          <>
            <MenuEntry label="Settings" href="/profile" onClick={closeMenu}>
              <Settings className="h-6 w-6" />
            </MenuEntry>
            <MenuEntry
              className="text-error"
              label="Log out"
              onClick={handleSignout}
            >
              <LogOut className="fill-error" />
            </MenuEntry>
          </>
        )}
      </ul>

      <div className="text-md mt-4 flex h-6 items-center justify-center text-neutral-400">
        Version {pkg.version}
      </div>
    </div>
  );
};
