"use client"
import { type User } from "@/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { BasicCard } from "./BasicCard";

type Props = {
  user: User;
};

export const UserCard: React.FC<Props> = ({ user }: Props) => {
  const router = useRouter();
  const { id, name, email, role, membershipId } = user;
  const showBadge = ["ADMIN", "LEADER"].includes(role);
  const badgeClass = clsx(
    "text-white badge",
    role === "LEADER" && "bg-accent",
    role === "ADMIN" && "bg-primary"
  );

  const onPress = () => {
    router.push(`/profile/${id}`);
  };

  return (
    <BasicCard key={id} id={id} onPress={onPress}>
      <div className="flex flex-col">
        <div className="p-2 flex-1">
          <div className="items-center align-middle font-bold uppercase tracking-wide">
            <div className="truncate">{name}</div>
          </div>
          <div className="truncate">{email}</div>
        </div>
        <div className="flex flex-row gap-2 p-2 pt-0">
          {showBadge && <div className={badgeClass}>{role}</div>}
          {membershipId && <div className="badge badge-secondary">MEMBER</div>}
        </div>
      </div>
    </BasicCard>
  );
};
