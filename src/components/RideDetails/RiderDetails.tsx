"use client";
import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { Phone, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { type User } from "../../types";

type Props = {
  user: User;
  isLeader: boolean;
  sessionUser?: string;
};

export const RiderDetails = ({ user, isLeader, sessionUser }: Props) => {
  const [showEmergency, setShowEmergency] = useState<boolean>(false);
  const { id: userId, name: userName, mobile, emergency, membershipId } = user;
  const isMe = sessionUser === userId;
  // Make emergency number callable - strip out text
  const emergencyNumber = emergency?.replace(/\D+/g, "");

  const switchClass = clsx(
    "relative inline-flex h-6 w-11 self-center items-center rounded-full",
    showEmergency ? "bg-red-600" : "bg-gray-200"
  );

  const toggleClass = clsx(
    "inline-block h-4 w-4 transform rounded-full bg-white transition",
    showEmergency ? "translate-x-6" : "translate-x-1"
  );

  const rowClass = clsx(
    "flex w-full flex-row items-center justify-between px-2 font-medium md:grid md:grid-cols-[1fr_96px] md:justify-start md:gap-4",
    isMe && "text-neutral-800"
  );

  const numberToDisplay = showEmergency ? emergencyNumber : mobile;

  const numberClass = clsx("flex items-center gap-2 px-4 rounded-md",
    showEmergency ? "bg-error text-white" : "bg-base-200 text-neutral-600"
  );

  return (
    <div className={rowClass} key={userId}>
      <div className="flex items-center gap-2">
        <div className="truncate">{userName}</div>
        {membershipId && <ShieldCheck className="text-secondary w-6 h-6" />}
      </div>

      {isLeader && (
        <div className="grid grid-cols-[44px_44px] gap-2">
          <div className={numberClass}>
            {numberToDisplay &&
              <a href={`tel:${numberToDisplay}`}>
                <Phone className="w-4 h-4" />
              </a>
            }
          </div>

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
