import { Button } from "@/components/Button";
import { type CalendarProps } from "@/components/Calendar";
import { FullPageContent } from "@/components/Layout/FullPageContent";
import { env } from "@/env";
import {
  formatCalendarDate,
  getLastMonth,
  getNextMonth,
  getNow,
} from "@utils/dates";
import { flattenQuery } from "@utils/general";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

const Calendar = dynamic<CalendarProps>(() => import("@/components/Calendar"));

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} Ride Calendar`,
};

export default async function RideCalendar(props: {
  params: Promise<{ date: string }>;
}) {
  const params = await props.params;
  const { date } = params;
  const monthDate = date ? flattenQuery(date) : getNow();
  const nextMonth = getNextMonth(monthDate).split("T")[0];
  const lastMonth = getLastMonth(monthDate).split("T")[0];

  return (
    <FullPageContent>
      <div className="flex h-[calc(100svh-64px)] w-full flex-col md:h-[calc(100svh-96px)]">
        <div className="flex w-full flex-col gap-2 bg-white">
          <div className="flex w-full flex-row items-center justify-between p-2 font-bold uppercase tracking-wider text-neutral-700">
            <Link href={`/calendar/${lastMonth}`} prefetch={true}>
              <Button accent>
                <ChevronLeft className="h-8 w-8" />
              </Button>
            </Link>
            <span>{formatCalendarDate(monthDate)}</span>
            <Link href={`/calendar/${nextMonth}`} prefetch={true}>
              <Button accent>
                <ChevronRight className="h-8 w-8" />
              </Button>
            </Link>
          </div>
        </div>
        <Calendar date={monthDate} />
      </div>
    </FullPageContent>
  );
}
