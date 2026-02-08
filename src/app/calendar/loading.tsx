import { type CalendarSkeletonProps } from "@/components/Calendar/CalendarSkeleton";
import { FullPageContent } from "@/components/Layout/FullPageContent";
import { getNow } from "@utils/dates";
import dynamic from "next/dynamic";

const CalendarSkeleton = dynamic<CalendarSkeletonProps>(
  () => import("@/components/Calendar/CalendarSkeleton"),
);

export default function LoadingCalendar() {
  const monthDate = getNow();

  return (
    <FullPageContent>
      <div className="flex h-[calc(100svh-64px)] w-full flex-col md:h-[calc(100svh-96px)]">
        <CalendarSkeleton date={monthDate} />
      </div>
    </FullPageContent>
  );
}
