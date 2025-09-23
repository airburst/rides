import { twMerge } from 'tailwind-merge';

type SkeletonProps = {
  height?: number;
  width?: number;
  className?: string;
}

export const Skeleton = ({ height = 4, width = 48, className }: SkeletonProps) => {
  const classes = twMerge("bg-gray-200 rounded-full",
    `h-${height}`,
    `w-${width}`,
    className,
  )
  return (
    <div role="status" className="max-w-sm animate-pulse flex items-center w-full">
      <div className={classes}></div>
    </div>
  );
}