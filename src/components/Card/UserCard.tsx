import { cn } from "@/lib/utils";
import { type User } from "@/types";
import { MembershipIcon } from "../MembershipIcon";
import { BasicCard } from "./BasicCard";

type Props = {
  user: User;
};

export const UserCard: React.FC<Props> = ({ user }: Props) => {
  const { id, name, email, role, membershipStatus } = user;
  const showBadge = ["ADMIN", "LEADER"].includes(role);
  const badgeClass = cn(
    "inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-medium text-white",
    role === "LEADER" && "bg-accent",
    role === "ADMIN" && "bg-primary",
  );

  return (
    <BasicCard id={id}>
      <div className="flex w-full flex-col">
        <div className="flex-1 p-2">
          <div className="flex items-center align-middle font-bold uppercase tracking-wide">
            <div className="flex-1 truncate">{name}</div>
            <MembershipIcon membershipStatus={membershipStatus} />
          </div>
          <div className="truncate">{email}</div>
        </div>
        <div className="flex flex-row gap-2 p-2 pt-0">
          {showBadge && <span className={badgeClass}>{role}</span>}
        </div>
      </div>
    </BasicCard>
  );
};
