import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { onlyNumbers } from "@utils/general";
import { Phone } from "lucide-react";
import { useState } from "react";
import { type User } from "../../types";
import { MembershipIcon } from "../MembershipIcon";

type Props = {
  user: User;
  isLeader: boolean;
  sessionUser?: string;
};

export const RiderDetails = ({ user, isLeader, sessionUser }: Props) => {
  const [showEmergency, setShowEmergency] = useState<boolean>(false);
  const {
    id: userId,
    name: userName,
    mobile,
    emergency,
    membershipStatus,
  } = user;
  const isMe = sessionUser === userId;
  // Make emergency number callable - strip out text
  const mobileNumber = onlyNumbers(mobile ?? "");
  const emergencyNumber = onlyNumbers(emergency ?? "");

  const rowClass = cn(
    "flex w-full flex-row items-center justify-between lg:px-4 font-medium md:grid md:grid-cols-[1fr_auto] md:justify-start md:gap-4",
    isMe && "text-neutral-800",
  );

  const numberToDisplay = showEmergency ? emergencyNumber : mobileNumber;

  const callButtonClass = cn(
    "inline-flex items-center justify-center rounded-md px-6 text-sm font-semibold tracking-wide h-full",
    showEmergency ? "bg-destructive text-white" : "bg-muted",
  );

  return (
    <div className={rowClass} key={userId}>
      <div className="flex items-center gap-1 truncate">
        <div className="truncate">{userName}</div>
        <MembershipIcon membershipStatus={membershipStatus} />
      </div>

      {isLeader && (
        <div className="grid grid-cols-[1fr_32px] grid-rows-[32px] gap-2 items-center">
          <a className={callButtonClass} href={`tel:${numberToDisplay}`}>
            <Phone />
          </a>

          <Switch
            className="data-[state=checked]:bg-red-600"
            checked={showEmergency}
            onCheckedChange={setShowEmergency}
            aria-label="Toggle emergency contact"
          />
        </div>
      )}
    </div>
  );
};
