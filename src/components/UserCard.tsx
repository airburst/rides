import { useRouter } from "next/router";
import { useState } from "react";
import clsx from "clsx";
import { User } from "../types";

type Props = {
  user: User;
};

export const UserCard: React.FC<Props> = ({ user }: Props) => {
  const [isSwiping, setSwiping] = useState(false);
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
    <div
      className="md:mx-autotext-neutral-500 box-border flex items-center w-full cursor-pointer gap-2 rounded bg-white shadow-md hover:text-neutral-700 hover:shadow-lg md:gap-2"
      key={id}
      id={id}
      role="presentation"
      onMouseDown={() => setSwiping(false)}
      onMouseMove={() => setSwiping(true)}
      onMouseUp={(e) => {
        if (!isSwiping && e.button === 0) {
          onPress();
        }
        setSwiping(false);
      }}
      onTouchStart={() => setSwiping(false)}
      onTouchMove={() => setSwiping(true)}
      onTouchEnd={(e) => {
        if (e.cancelable) e.preventDefault();
        if (!isSwiping) {
          onPress();
        }
        setSwiping(false);
      }}
    >
      <div className="flex-col lg:flex-row flex-1 p-2 gap-1 truncate">
        <div className="align-middle font-bold uppercase tracking-wide">
          {name}
        </div>
        <div className="truncate">{email}</div>
      </div>

      {showBadge && <div className={badgeClass}>{role}</div>}
    </div>
  );
};
