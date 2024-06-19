import { getRides } from "@/server/actions/getRides";
import { formatCalendarDate, getLastMonth, getMonthDateRange, getNextMonth, getNow } from "@utils/dates";
import { flattenQuery } from "@utils/general";
import Link from "next/link";
import { Calendar } from ".";
import { Button } from "../Button";
import { ChevronLeftIcon, ChevronRightIcon } from "../Icon";
import { FullPageContent } from "../Layout/FullPageContent";
import { MainContent } from "../Layout/MainContent";

type Props = {
  date?: string;
}

export const CalendarPage = async ({ date }: Props) => {
  const monthDate = date ? flattenQuery(date) : getNow();
  const { start, end } = getMonthDateRange(monthDate);
  const nextMonth = getNextMonth(date).split("T")[0];
  const lastMonth = getLastMonth(date).split("T")[0];

  // Fetch rides for month
  const { rides, error } = await getRides(start, end);

  if (error) {
    return <MainContent>
      <div>{error.message}</div>
    </MainContent>
  }

  return (
    <FullPageContent>
      <div className="flex flex-col h-[100vh] w-full">
        <div className="flex w-full flex-col gap-2 bg-primary">
          <div className="flex w-full flex-row items-center justify-between p-2 font-bold uppercase tracking-wider text-white">
            <Link href={`/calendar/${lastMonth}`}><Button accent>
              <ChevronLeftIcon className="fill-accent-content" />
            </Button></Link>
            <span>{formatCalendarDate(monthDate)}</span>
            <Link href={`/calendar/${nextMonth}`}><Button accent>
              <ChevronRightIcon className="fill-accent-content" />
            </Button></Link>
          </div>
        </div>

        <Calendar date={monthDate} rides={rides} />
      </div>
    </FullPageContent>
  )
}