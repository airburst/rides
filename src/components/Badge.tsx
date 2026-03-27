import { cn } from "@/lib/utils";

type Props = {
  text?: string | number;
  style?: string;
  small?: boolean;
  className?: string;
};

const styleMap: Record<string, string> = {
  unready: "bg-red-500",
  ready: "bg-primary",
  past: "bg-zinc-400",
};

export const Badge = ({ text, style = "unready", small, className }: Props) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border-0 text-xs font-medium text-white",
        small ? "px-1.5 py-0.5" : "px-2 py-0.5",
        styleMap[style],
        className,
      )}
    >
      {text}
    </span>
  );
};

export const RoundBadge = ({ text, style = "unready" }: Props) => {
  return (
    <span
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full text-white lg:text-xl",
        styleMap[style],
      )}
    >
      <span className="flex justify-center">{text}</span>
    </span>
  );
};
