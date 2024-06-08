import clsx from "clsx";

type Props = {
  cancelled: boolean;
  position?: "top" | "bottom";
};

export const Cancelled = ({ cancelled, position = "top" }: Props) => {
  const classes = clsx(
    "absolute w-[calc(100%_-_8px)] m-1 text-lg",
    { "bottom-0": position === "bottom" },
    "badge badge-error rounded gap-8 uppercase py-4"
  );
  return cancelled ? (
    <div className={classes}>
      <span>⚠️</span>
      This ride is Cancelled
      <span>⚠️</span>
    </div>
  ) : null;
};
