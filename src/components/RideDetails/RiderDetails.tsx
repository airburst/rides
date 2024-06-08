"use client";
import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";
import { type User } from "../../types";
import { PhoneIcon } from "../Icon";

type Props = {
  user: User;
  isLeader: boolean;
  sessionUser?: string;
};

export const RiderDetails = ({ user, isLeader, sessionUser }: Props) => {
  const [showEmergency, setShowEmergency] = useState<boolean>(false);
  const { id: userId, name: userName, mobile, emergency } = user;
  const isMe = sessionUser === userId;
  // Make emergency number callable - strip out text
  const emergencyNumber = emergency?.replace(/\D+/g, "");

  const switchClass = clsx(
    "relative inline-flex h-6 w-11 items-center rounded-full",
    showEmergency ? "bg-red-600" : "bg-gray-200"
  );

  const toggleClass = clsx(
    "inline-block h-4 w-4 transform rounded-full bg-white transition",
    showEmergency ? "translate-x-6" : "translate-x-1"
  );

  const rowClass = clsx(
    "flex w-full flex-row items-center justify-between px-2 font-medium md:grid md:grid-cols-[220px_1fr] md:justify-start md:gap-4",
    isMe && "text-neutral-800"
  );

  return (
    <div className={rowClass} key={userId}>
      <div className="truncate">{userName}</div>

      {isLeader && (
        <div className="grid grid-cols-[1fr_44px] gap-2">
          {!showEmergency && (
            <div className="flex items-center gap-2">
              {mobile && <PhoneIcon className="fill-neutral-500" />}
              <a href={`tel:${mobile}`} className="text-right">
                {mobile}
              </a>
            </div>
          )}
          {showEmergency && (
            <div className="flex items-center gap-2 text-red-700">
              <a href={`tel:${emergencyNumber}`} className="text-right">
                {emergency}
              </a>
            </div>
          )}

          <Switch
            checked={showEmergency}
            onChange={setShowEmergency}
            className={switchClass}
          >
            <span className="sr-only">Enable notifications</span>
            <span className={toggleClass} />
          </Switch>
        </div>
      )}
    </div>
  );
};
