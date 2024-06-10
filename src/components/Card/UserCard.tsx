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
  const { id, name, email, role } = user;
  const showBadge = ["ADMIN", "LEADER"].includes(role);
  const badgeClass = clsx(
    "px-2 text-white h-full flex items-center justify-center rounded-r w-24",
    role === "LEADER" && "bg-secondary",
    role === "ADMIN" && "bg-primary"
  );

  const onPress = () => {
    router.push(`/profile/${id}`);
  };

  return (
    <BasicCard key={id} id={id} onPress={onPress}>
      <div className="flex-col lg:flex-row flex-1 p-2 gap-1 truncate">
        <div className="align-middle font-bold uppercase tracking-wide">
          {name}
        </div>
        <div className="truncate">{email}</div>
      </div>

      {showBadge && <div className={badgeClass}>{role}</div>}
    </BasicCard>
  );
};
