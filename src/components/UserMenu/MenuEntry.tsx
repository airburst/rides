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
    <li className="hover:bg-neutral-800 hover:text-white rounded">
      <Link href={href}>
        <button
          type="button"
          className="grid w-full grid-cols-[20px_1fr] items-center gap-2"
          onClick={onClick}
        >
          {children}
          <span className="justify-self-start">{label}</span>
        </button>
      </Link>
    </li>
  ) : (
    <li className="hover:bg-neutral-800 hover:text-white rounded">
      <button
        type="button"
        className="grid w-full grid-cols-[20px_1fr] items-center gap-2"
        onClick={onClick}
      >
        {children}
        <span className="justify-self-start">{label}</span>
      </button>
    </li>
  );
