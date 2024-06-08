import clsx from "clsx";

type Props = {
  text?: string | number;
  style?: string;
  small?: boolean;
};

export const Badge = ({ text, style = "unready", small }: Props) => {
  const classes = clsx(
    "badge text-white border-0",
    { "bg-red-500": style === "unready" },
    { "bg-primary": style === "ready" },
    { "bg-slate-500": style === "past" },
    { "badge-md": !small },
    { "badge-sm": small }
  );

  return <div className={classes}>{text}</div>;
};

export const RoundBadge = ({ text, style = "unready", small }: Props) => {
  const classes = clsx(
    "badge badge-lg text-white w-10 h-10",
    { "bg-red-500": style === "unready" },
    { "bg-primary": style === "ready" },
    { "bg-slate-500": style === "past" },
    { "badge-sm": small }
  );

  return (
    <div className={classes}>
      <span className="flex justify-center">{text}</span>
    </div>
  );
};
