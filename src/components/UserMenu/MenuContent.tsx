import { type Role } from "@/types";
import copyToClipboard from "copy-to-clipboard";
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
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { flattenQuery } from "@utils/general";
import { toast } from "sonner";
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

  const copyLink = () => {
    if (!rideId) return;
    const shortId = rideId.slice(-6);
    const url = `${window.location.origin}/r/${shortId}`;
    copyToClipboard(url);
    toast.success("Short link copied to clipboard");
    closeMenu();
  };

  return (
    <div className="min-h-full w-80 bg-neutral-900 px-2 sm:w-96">
      <div className="flex h-16 flex-col items-end justify-center rounded text-3xl sm:h-24 sm:items-start sm:pl-2">
        <button
          type="button"
          onClick={closeMenu}
          onKeyDown={closeMenu}
          aria-label="open menu"
          className="w-full cursor-pointer px-2"
        >
          <X className="h-8 w-8 text-white" />
        </button>
      </div>

      <ul className="flex flex-col gap-1 p-0 text-xl text-neutral-300">
        {!isAuthenticated && (
          <MenuEntry label="Log in" onClick={handleSignin}>
            <LogIn className="h-6 w-6" />
          </MenuEntry>
        )}

        {isAuthenticated && (
          <MenuEntry label="Profile" href="/profile" onClick={closeMenu}>
            <User className="h-6 w-6" />
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
            {rideId && (
              <MenuEntry label="Copy Ride Link" onClick={copyLink}>
                <Link className="h-6 w-6" />
              </MenuEntry>
            )}
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
          <MenuEntry
            className="text-destructive"
            label="Log out"
            onClick={handleSignout}
          >
            <LogOut className="fill-destructive" />
          </MenuEntry>
        )}
      </ul>

      <div className="text-md mt-4 flex h-6 items-center justify-center text-neutral-400">
        Version {pkg.version}
      </div>
    </div>
  );
};
