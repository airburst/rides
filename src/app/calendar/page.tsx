import { Button } from "@/components/Button";
import { Calendar } from "@/components/Calendar";
import { CalendarSkeleton } from "@/components/Calendar/CalendarSkeleton";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/Icon";
import { FullPageContent } from "@/components/Layout/FullPageContent";
import { env } from "@/env";
import { formatCalendarDate, getLastMonth, getNextMonth, getNow } from "@utils/dates";
import { type Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} Ride Calendar`,
}

export default async function RideCalendar() {
  const monthDate = getNow();
  const nextMonth = getNextMonth(monthDate).split("T")[0];
  const lastMonth = getLastMonth(monthDate).split("T")[0];

  return (
    <FullPageContent>
      <div className="flex flex-col h-[100svh] w-full">
        <div className="flex w-full flex-col gap-2 bg-white">
          <div className="flex w-full flex-row items-center justify-between p-2 font-bold uppercase tracking-wider text-neutral-700">
            <Link href={`/calendar/${lastMonth}`} title="go to previous month"><Button accent ariaLabel="go to previous month">
              <ChevronLeftIcon className="fill-accent-content" />
            </Button></Link>
            <span>{formatCalendarDate(monthDate)}</span>
            <Link href={`/calendar/${nextMonth}`} title="go to next month"><Button accent ariaLabel="go to next month">
              <ChevronRightIcon className="fill-accent-content" />
            </Button></Link>
          </div>
        </div>
        <Suspense fallback={<CalendarSkeleton date={monthDate} />}>
          <Calendar date={monthDate} />
        </Suspense>
      </div>
    </FullPageContent>
  )
};
