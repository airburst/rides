import { Button } from "@/components/Button";
import { type CalendarProps } from "@/components/Calendar";
import { FullPageContent } from "@/components/Layout/FullPageContent";
import { env } from "@/env";
import { formatCalendarDate, getLastMonth, getNextMonth, getNow } from "@utils/dates";
import { flattenQuery } from "@utils/general";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

const Calendar = dynamic<CalendarProps>(() => import('@/components/Calendar'));

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} Ride Calendar`,
}

export default async function RideCalendar({ params }: { params: { date: string } }) {
  const { date } = params;
  const monthDate = date ? flattenQuery(date) : getNow();
  const nextMonth = getNextMonth(monthDate).split("T")[0];
  const lastMonth = getLastMonth(monthDate).split("T")[0];

  return (
    <FullPageContent>
      <div className="flex flex-col h-[calc(100svh_-_64px)] md:h-[calc(100svh_-_96px)] w-full">
        <div className="flex w-full flex-col gap-2 bg-white">
          <div className="flex w-full flex-row items-center justify-between p-2 font-bold uppercase tracking-wider text-neutral-700">
            <Link href={`/calendar/${lastMonth}`} prefetch={false}><Button accent>
              <ChevronLeft className="w-8 h-8" />
            </Button></Link>
            <span>{formatCalendarDate(monthDate)}</span>
            <Link href={`/calendar/${nextMonth}`} prefetch={false}><Button accent>
              <ChevronRight className="w-8 h-8" />
            </Button></Link>
          </div>
        </div>
        <Calendar date={monthDate} />
      </div>
    </FullPageContent>
  )
};
