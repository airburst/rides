import Link from "next/link";
import { type ReactNode } from "react";

type MenuEntryProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
  href?: string;
};

export const MenuEntry = ({
  label,
  onClick,
  href,
  children,
}: MenuEntryProps) =>
  href ? (
    <Link href={href}>
      <div className="cursor-pointer border-b-[1px] border-b-neutral-100 p-2 hover:bg-neutral-200 hover:text-neutral-900">
        <button
          type="button"
          className="items-centert grid w-full grid-cols-[20px_1fr] items-center gap-2"
          onClick={onClick}
        >
          {children}
          <span className="justify-self-start">{label}</span>
        </button>
      </div>
    </Link>
  ) : (
    <div className="cursor-pointer border-b-[1px] border-b-neutral-100 p-2 hover:bg-neutral-200 hover:text-neutral-900">
      <button
        type="button"
        className="items-centert grid w-full grid-cols-[20px_1fr] items-center gap-2"
        onClick={onClick}
      >
        {children}
        <span className="justify-self-start">{label}</span>
      </button>
    </div>
  );
