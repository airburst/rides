import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
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
  const classes = cn(
    "hover:bg-neutral-800 hover:text-white rounded",
    className,
  );

  const innerClasses = "grid w-full grid-cols-[20px_1fr] items-center gap-6 px-4 py-1";

  return href ? (
    <li className={classes}>
      <Link
        to={href}
        className={cn(innerClasses, "focus:bg-neutral-800 focus:text-white")}
        onClick={onClick}
      >
        {children}
        <span className="justify-self-start">{label}</span>
      </Link>
    </li>
  ) : (
    <li className={classes}>
      <button
        type="button"
        className={innerClasses}
        onClick={onClick}
      >
        {children}
        <span className="justify-self-start">{label}</span>
      </button>
    </li>
  );
};
