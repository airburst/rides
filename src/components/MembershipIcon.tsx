import { Handshake, ShieldAlert, ShieldCheck } from "lucide-react";

type MembershipIconProps = {
  membershipStatus?: string;
};

export const MembershipIcon = ({ membershipStatus }: MembershipIconProps) => {
  switch (membershipStatus) {
    case "MEMBER":
      return <ShieldCheck className="text-secondary" />;
    case "EXPIRED":
      return <ShieldAlert className="text-destructive" />;
    case "OTHER_CLUB":
      return <Handshake className="text-primary" />;
    default:
      // "NOT_MEMBER":
      return null;
    // return <ShieldOff className="text-destructive" />;
  }
};
