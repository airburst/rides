import { twMerge } from "tailwind-merge";

type SkeletonProps = {
  height?: number;
  width?: number;
  className?: string;
};

export const Skeleton = ({
  height = 4,
  width = 48,
  className,
}: SkeletonProps) => {
  const classes = twMerge(
    "bg-gray-200 rounded-full",
    `h-${height}`,
    `w-${width}`,
    className,
  );
  return (
    // biome-ignore lint/a11y/useSemanticElements: its-ok
    <div
      role="status"
      className="flex w-full max-w-sm animate-pulse items-center"
    >
      <div className={classes} />
    </div>
  );
};
