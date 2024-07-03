/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { type Role } from "@/types";
import copy from "copy-to-clipboard";
import { flattenQuery } from "shared/utils";
import pkg from "../../../package.json";
import {
  CalendarIcon,
  CircleExclamationIcon,
  CloseIcon,
  CopyIcon,
  DeleteIcon,
  EditIcon,
  LinkIcon,
  LoginIcon,
  LogoutIcon,
  PlusIcon,
  RepeatIcon,
  SettingsIcon,
  UsersIcon
} from "../Icon";
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
};

export const MenuContent = ({ role, isAuthenticated, handleSignin, handleSignout, closeMenu, rideId, confirmCancel, confirmDelete }: MenuContentProps) => {
  const isLeader = role && ["ADMIN", "LEADER"].includes(role);
  const isAdmin = role === "ADMIN";
  const showEditAndDelete = isLeader && rideId;

  const copyLink = () => copy(window.location.href); // next usePathname?

  return (
    <div className="w-80 sm:w-96 min-h-full bg-dark-100 px-2">
      <div className="h-16 sm:h-24 sm:pl-2 flex flex-col items-end sm:items-start justify-center cursor-pointer rounded text-3xl">
        <button
          type="button"
          onClick={closeMenu}
          onKeyDown={closeMenu}
          aria-label="open menu">
          <CloseIcon className="fill-white w-8 h-8" />
        </button>
      </div>

      <ul className="menu text-base-300 text-lg p-0">
        {!isAuthenticated && (
          <MenuEntry label="Log in" onClick={handleSignin}>
            <LoginIcon className="fill-white" />
          </MenuEntry>
        )}

        <MenuEntry label="Calendar" href="/calendar" onClick={closeMenu}>
          <CalendarIcon className="fill-white" />
        </MenuEntry>

        {isLeader && (
          <MenuEntry label="Add Ride" href="/ride/new" onClick={closeMenu}>
            <PlusIcon className="fill-white" />
          </MenuEntry>
        )}

        {isLeader && rideId && (
          <MenuEntry
            label="Copy Ride"
            href={`/ride/copy/${flattenQuery(rideId)}`}
            onClick={closeMenu}
          >
            <CopyIcon className="fill-white" />
          </MenuEntry>
        )}

        {showEditAndDelete && (
          <>
            <MenuEntry
              label="Edit Ride"
              href={`/ride/edit/${flattenQuery(rideId)}`}
              onClick={closeMenu}
            >
              <EditIcon className="fill-white" />
            </MenuEntry>
            <MenuEntry label="Cancel Ride" onClick={confirmCancel}>
              <CircleExclamationIcon className="fill-white" />
            </MenuEntry>
            <MenuEntry label="Delete Ride" onClick={confirmDelete}>
              <DeleteIcon className="fill-white" />
            </MenuEntry>
            <MenuEntry label="Copy Ride Link" onClick={copyLink}>
              <LinkIcon className="fill-white" />
            </MenuEntry>
          </>
        )}

        {isAdmin && (
          <>
            <MenuEntry label="Manage Users" href="/users" onClick={closeMenu}>
              <UsersIcon className="fill-white" />
            </MenuEntry>
            <MenuEntry
              label="Repeating Rides"
              href="/repeating-rides"
              onClick={closeMenu}
            >
              <RepeatIcon className="fill-white" />
            </MenuEntry>
          </>
        )}

        {isAuthenticated && (
          <>
            <MenuEntry label="Settings" href="/profile" onClick={closeMenu}>
              <SettingsIcon className="fill-white" />
            </MenuEntry>
            <MenuEntry className="text-error" label="Log out" onClick={handleSignout}>
              <LogoutIcon className="fill-error" />
            </MenuEntry>
          </>
        )}
      </ul>

      <div className="flex h-6 items-center justify-center text-xs text-neutral-400 mt-4">
        Version {pkg.version}
      </div>
    </div>
  );
};
