"use client";
import { type User } from "@/types";
import clsx from "clsx";
import { MembershipIcon } from "../MembershipIcon";

type Props = {
  user: User;
};

export const UserCard: React.FC<Props> = ({ user }: Props) => {
  const { id, name, email, role, membershipStatus } = user;
  const showBadge = ["ADMIN", "LEADER"].includes(role);
  const badgeClass = clsx(
    "text-white badge badge-lg",
    role === "LEADER" && "bg-accent",
    role === "ADMIN" && "bg-primary",
  );

  return (
    <div
      id={id}
      role="presentation"
      className="relative box-border flex h-full w-full cursor-pointer gap-2 rounded-lg bg-white p-1 text-neutral-500 shadow-md hover:shadow-lg md:mx-auto md:gap-2"
    >
      <div className="flex w-full flex-col">
        <div className="flex-1 p-2">
          <div className="flex items-center align-middle font-bold uppercase tracking-wide">
            <div className="flex-1 truncate">{name}</div>
            <MembershipIcon
              membershipStatus={membershipStatus ?? "NON_MEMBER"}
            />
          </div>
          <div className="truncate">{email}</div>
        </div>
        <div className="flex flex-row gap-2 p-2 pt-0">
          {showBadge && <div className={badgeClass}>{role}</div>}
        </div>
      </div>
    </div>
  );
};
