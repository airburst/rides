import { ShieldAlert, ShieldCheck, ShieldOff, ShieldPlus } from "lucide-react";

type MembershipIconProps = {
  membershipStatus: string;
};

export const MembershipIcon = ({ membershipStatus }: MembershipIconProps) => {
  switch (membershipStatus) {
    case "MEMBER":
      return <ShieldCheck className="h-6 w-6 text-secondary" />;
    case "EXPIRED":
      return <ShieldAlert className="h-6 w-6 text-error" />;
    case "OTHER_CLUB":
      return <ShieldPlus className="h-6 w-6 text-primary" />;
    default:
      // "NOT_MEMBER":
      return <ShieldOff className="h-6 w-6 text-error" />;
  }
};
