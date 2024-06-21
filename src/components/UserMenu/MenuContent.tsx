/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { env } from "@/env";
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

const { NEXT_PUBLIC_REPO } = env;

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
    <div className="w-80 min-h-full bg-dark-100">
      <div className="h-16 sm:h-24 flex flex-col items-end sm:items-start justify-center cursor-pointer rounded p-4 text-3xl">
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
            <LoginIcon className="fill-neutral-700" />
          </MenuEntry>
        )}

        <MenuEntry label="Calendar" href="/calendar" onClick={closeMenu}>
          <CalendarIcon className="fill-neutral-700" />
        </MenuEntry>

        {isLeader && (
          <MenuEntry label="Add Ride" href="/ride/new" onClick={closeMenu}>
            <PlusIcon className="fill-neutral-700" />
          </MenuEntry>
        )}

        {isLeader && rideId && (
          <MenuEntry
            label="Copy Ride"
            href={`/ride/${flattenQuery(rideId)}/copy`}
            onClick={closeMenu}
          >
            <CopyIcon className="fill-neutral-700" />
          </MenuEntry>
        )}

        {showEditAndDelete && (
          <>
            <MenuEntry
              label="Edit Ride"
              href={`/ride/${flattenQuery(rideId)}/edit`}
              onClick={closeMenu}
            >
              <EditIcon className="fill-neutral-700" />
            </MenuEntry>
            <MenuEntry label="Cancel Ride" onClick={confirmCancel}>
              <CircleExclamationIcon className="fill-neutral-700" />
            </MenuEntry>
            <MenuEntry label="Delete Ride" onClick={confirmDelete}>
              <DeleteIcon className="fill-neutral-700" />
            </MenuEntry>
            <MenuEntry label="Copy Ride Link" onClick={copyLink}>
              <LinkIcon className="fill-neutral-700" />
            </MenuEntry>
          </>
        )}

        {isAdmin && (
          <>
            <MenuEntry label="Manage Users" href="/users" onClick={closeMenu}>
              <UsersIcon className="fill-neutral-700" />
            </MenuEntry>
            <MenuEntry
              label="Repeating Rides"
              href="/repeating-rides"
              onClick={closeMenu}
            >
              <RepeatIcon className="fill-neutral-700" />
            </MenuEntry>
          </>
        )}

        {isAuthenticated && (
          <>
            <MenuEntry label="Settings" href="/profile" onClick={closeMenu}>
              <SettingsIcon className="fill-neutral-700" />
            </MenuEntry>
            <MenuEntry label="Log out" onClick={handleSignout}>
              <LogoutIcon className="fill-neutral-700" />
            </MenuEntry>
          </>
        )}
      </ul>

      <div className="flex h-6 items-center justify-between px-2 pl-2 text-xs text-neutral-400">
        Version {pkg.version}
        <a
          href={`${NEXT_PUBLIC_REPO}/blob/main/CHANGELOG.md`}
          title="Release notes"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-primary underline"
        >
          Notes
        </a>
      </div>
    </div>
  );
};
