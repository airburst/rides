"use client";
import { Switch } from "@headlessui/react";
import { onlyNumbers } from "@utils/general";
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
  const { id: userId, name: userName, mobile, emergency, isMember } = user;
  const isMe = sessionUser === userId;
  // Make emergency number callable - strip out text
  const mobileNumber = onlyNumbers(mobile!);
  const emergencyNumber = onlyNumbers(emergency!);

  const switchClass = clsx(
    "relative inline-flex h-6 w-11 self-center items-center rounded-full",
    showEmergency ? "bg-red-600" : "bg-gray-200"
  );

  const toggleClass = clsx(
    "inline-block h-4 w-4 transform rounded-full bg-white transition",
    showEmergency ? "translate-x-6" : "translate-x-1"
  );

  const rowClass = clsx(
    "flex w-full flex-row items-center justify-between px-2 font-medium md:grid md:grid-cols-[1fr_auto] md:justify-start md:gap-4",
    isMe && "text-neutral-800"
  );

  const numberToDisplay = showEmergency ? emergencyNumber : mobileNumber;

  const numberClass = clsx("flex items-center gap-2 px-1 rounded-md",
    showEmergency ? "bg-error text-white" : "text-neutral-600"
  );

  return (
    <div className={rowClass} key={userId}>
      <div className="flex items-center truncate gap-1">
        <div className="truncate">{userName}</div>
        {isMember && <ShieldCheck className="text-secondary w-6 h-6" />}
      </div>

      {isLeader && (
        <div className="grid grid-cols-[1fr_44px] gap-1">
          <div className={numberClass}>
            {numberToDisplay &&
              <a className="flex flex-row items-center gap-2 truncate" href={`tel:${numberToDisplay}`}>
                <Phone className="w-4 h-4" />
                {numberToDisplay}
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
