import { Button } from "@/components/Button";
import { type CalendarProps } from "@/components/Calendar";
import { FullPageContent } from "@/components/Layout/FullPageContent";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getNow } from "@utils/dates";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { lazy, Suspense } from "react";
import {
  formatCalendarDate,
  getLastMonth,
  getNextMonth,
} from "./calendarDates";

const Calendar = lazy<React.ComponentType<CalendarProps>>(
  () => import("@/components/Calendar"),
);

export const Route = createFileRoute("/calendar/$date")({
  component: RideCalendarDate,
});

function RideCalendarDate() {
  const { date } = Route.useParams();
  const monthDate = date ?? getNow();
  const nextMonth = getNextMonth(monthDate).split("T")[0]!;
  const lastMonth = getLastMonth(monthDate).split("T")[0]!;

  return (
    <FullPageContent>
      <div className="flex h-[calc(100svh-64px)] w-full flex-col md:h-[calc(100svh-96px)]">
        <div className="flex w-full flex-col gap-2 bg-white">
          <div className="flex w-full flex-row items-center justify-between p-2 font-bold uppercase tracking-wider text-neutral-700">
            <Link to="/calendar/$date" params={{ date: lastMonth }}>
              <Button>
                <ChevronLeft className="h-8 w-8" />
              </Button>
            </Link>
            <span>{formatCalendarDate(monthDate)}</span>
            <Link to="/calendar/$date" params={{ date: nextMonth }}>
              <Button>
                <ChevronRight className="h-8 w-8" />
              </Button>
            </Link>
          </div>
        </div>
        <Suspense>
          <Calendar date={monthDate} />
        </Suspense>
      </div>
    </FullPageContent>
  );
}
