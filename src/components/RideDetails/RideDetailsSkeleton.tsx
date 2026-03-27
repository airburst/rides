import { SectionHeader } from "../SectionHeader";
import { Skeleton } from "../Skeleton";

export const RideDetailsSkeleton = () => (
  <div className="flex w-full flex-col gap-4 mt-4 pb-24">
    <SectionHeader>Ride Details</SectionHeader>

    <div className="flex w-full flex-col gap-2 lg:gap-4 px-2 sm:px-0">
      {/* Hero card skeleton */}
      <div className="flex w-full flex-col gap-3 rounded bg-white p-3 lg:p-4 shadow-md">
        {/* Time */}
        <Skeleton width={16} height={3} />
        {/* Name + group badge */}
        <div className="flex items-center gap-3">
          <Skeleton className="w-48" height={6} />
          <Skeleton width={24} height={5} />
        </div>
        {/* Location */}
        <div className="flex items-center gap-2">
          <Skeleton width={4} height={4} className="rounded" />
          <Skeleton className="w-56" />
        </div>
        {/* Distance + leader */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <Skeleton width={4} height={4} className="rounded" />
            <Skeleton width={16} />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton width={4} height={4} className="rounded" />
            <Skeleton width={20} />
          </div>
        </div>
        {/* Route button */}
        <Skeleton className="w-full" height={10} />
      </div>

      {/* Notes skeleton */}
      <div className="flex w-full flex-col gap-2 rounded bg-white py-2 lg:py-4 shadow-md">
        <div className="px-2 lg:px-4">
          <Skeleton width={16} height={5} />
        </div>
        <div className="flex flex-col gap-2 px-2 lg:px-4">
          <Skeleton className="w-full" />
          <Skeleton className="w-60" />
          <Skeleton className="w-50" />
        </div>
      </div>
    </div>

    <SectionHeader>Going</SectionHeader>

    <div className="flex w-full flex-col gap-2 lg:gap-4 px-2 sm:px-0">
      <div className="flex w-full flex-col gap-3 rounded bg-white py-2 lg:py-4 shadow-md">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 px-2 lg:px-4">
            <Skeleton width={8} height={8} className="rounded-full" />
            <Skeleton className="w-40" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
