/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { type Role } from "@/types";
import copy from "copy-to-clipboard";
import { Calendar, CircleAlert, Copy, Link, LogIn, LogOut, Pencil, Plus, Repeat, Settings, Trash2, Users, X } from 'lucide-react';
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
          <X className="w-8 h-8" />
        </button>
      </div>

      <ul className="menu text-base-300 text-xl p-0">
        {!isAuthenticated && (
          <MenuEntry label="Log in" onClick={handleSignin}>
            <LogIn className="w-6 h-6" />
          </MenuEntry>
        )}

        <MenuEntry label="Calendar" href="/calendar" onClick={closeMenu}>
          <Calendar className="h-6 w-6" />
        </MenuEntry>

        {isLeader && (
          <MenuEntry label="Add Ride" href="/ride/new" onClick={closeMenu}>
            <Plus className="w-6 h-6" />
          </MenuEntry>
        )}

        {isLeader && rideId && (
          <MenuEntry
            label="Copy Ride"
            href={`/ride/copy/${flattenQuery(rideId)}`}
            onClick={closeMenu}
          >
            <Copy className="w-6 h-6" />
          </MenuEntry>
        )}

        {showEditAndDelete && (
          <>
            <MenuEntry
              label="Edit Ride"
              href={`/ride/edit/${flattenQuery(rideId)}`}
              onClick={closeMenu}
            >
              <Pencil className="w-6 h-6" />
            </MenuEntry>
            <MenuEntry label="Cancel Ride" onClick={confirmCancel}>
              <CircleAlert className="w-6 h-6" />
            </MenuEntry>
            <MenuEntry label="Delete Ride" onClick={confirmDelete}>
              <Trash2 className="w-6 h-6" />
            </MenuEntry>
            <MenuEntry label="Copy Ride Link" onClick={copyLink}>
              <Link className="w-6 h-6" />
            </MenuEntry>
          </>
        )}

        {isAdmin && (
          <>
            <MenuEntry label="Manage Users" href="/users" onClick={closeMenu}>
              <Users className="w-6 h-6" />
            </MenuEntry>
            <MenuEntry
              label="Repeating Rides"
              href="/repeating-rides"
              onClick={closeMenu}
            >
              <Repeat className="w-6 h-6" />
            </MenuEntry>
          </>
        )}

        {isAuthenticated && (
          <>
            <MenuEntry label="Settings" href="/profile" onClick={closeMenu}>
              <Settings className="w-6 h-6" />
            </MenuEntry>
            <MenuEntry className="text-error" label="Log out" onClick={handleSignout}>
              <LogOut className="fill-error" />
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
