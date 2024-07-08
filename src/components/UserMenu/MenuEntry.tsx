import clsx from "clsx";
import Link from "next/link";
import { type ReactNode } from "react";

type MenuEntryProps = {
  label: string;
  className?: string;
  onClick: () => void;
  children: ReactNode;
  href?: string;
};

export const MenuEntry = ({
  label,
  onClick,
  href,
  className,
  children,
}: MenuEntryProps) => {
  const classes = clsx("hover:bg-neutral-800 hover:text-white rounded", className);

  return href ? (
    <li className={classes}>
      <Link href={href} className="px-4 py-2 focus:text-white focus:bg-neutral-800">
        <button
          type="button"
          className="grid w-full grid-cols-[20px_1fr] items-center gap-6"
          onClick={onClick}
        >
          {children}
          <span className="justify-self-start">{label}</span>
        </button>
      </Link>
    </li>
  ) : (
    <li className={classes}>
      <button
        type="button"
        className="grid w-full grid-cols-[20px_1fr] items-center gap-6"
        onClick={onClick}
      >
        {children}
        <span className="justify-self-start">{label}</span>
      </button>
    </li>
  );

}
