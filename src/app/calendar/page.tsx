"use client";

import { Button } from "@/components/Button";
import { type CalendarProps } from "@/components/Calendar";
import { FullPageContent } from "@/components/Layout/FullPageContent";
import {
  formatCalendarDate,
  getLastMonth,
  getNextMonth,
  getNow,
} from "@utils/dates";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamicImport from "next/dynamic";
import Link from "next/link";

const Calendar = dynamicImport<CalendarProps>(() => import("@/components/Calendar"));

export default function RideCalendar() {
  const monthDate = getNow();
  const nextMonth = getNextMonth(monthDate).split("T")[0];
  const lastMonth = getLastMonth(monthDate).split("T")[0];

  return (
    <FullPageContent>
      <div className="flex h-[calc(100svh-64px)] w-full flex-col md:h-[calc(100svh-96px)]">
        <div className="flex w-full flex-col gap-2 bg-white">
          <div className="flex w-full flex-row items-center justify-between p-2 font-bold uppercase tracking-wider text-neutral-700">
            <Link
              href={`/calendar/${lastMonth}`}
              title="go to previous month"
              prefetch={true}
            >
              <Button accent ariaLabel="go to previous month">
                <ChevronLeft className="h-8 w-8" />
              </Button>
            </Link>
            <span>{formatCalendarDate(monthDate)}</span>
            <Link
              href={`/calendar/${nextMonth}`}
              title="go to next month"
              prefetch={true}
            >
              <Button accent ariaLabel="go to next month">
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
