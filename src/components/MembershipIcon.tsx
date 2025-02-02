import { Handshake, ShieldAlert, ShieldCheck } from "lucide-react";

type MembershipIconProps = {
  membershipStatus?: string;
};

export const MembershipIcon = ({ membershipStatus }: MembershipIconProps) => {
  switch (membershipStatus) {
    case "MEMBER":
      return <ShieldCheck className="h-6 w-6 text-secondary" />;
    case "EXPIRED":
      return <ShieldAlert className="h-6 w-6 text-error" />;
    case "OTHER_CLUB":
      return <Handshake className="h-6 w-6 text-primary" />;
    default:
      // "NOT_MEMBER":
      return null;
    // return <ShieldOff className="h-6 w-6 text-error" />;
  }
};
