import { Button, Calendar, ChevronLeftIcon, ChevronRightIcon, FullPageContent, MainContent } from "@/components";
import { env } from "@/env";
import { getRides } from "@/server/actions/getRides";
import { formatCalendarDate, getMonthDateRange, getNow } from "@utils/dates";
import { type Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} Ride Calendar`,
}

export default async function RideCalendar() {
  const date = getNow();
  const { start, end } = getMonthDateRange(date);
  // Fetch rides for month
  // TODO: Move this into RSC and add Suspense
  const { rides, error } = await getRides(start, end);

  // const goToNextMonth = () => setDate(getNextMonth(date));
  // const goToLastMonth = () => setDate(getLastMonth(date));

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
            <Button accent>
              <ChevronLeftIcon className="fill-accent-content" />
            </Button>
            <span>{formatCalendarDate(date)}</span>
            <Button accent>
              <ChevronRightIcon className="fill-accent-content" />
            </Button>
          </div>
        </div>

        <Calendar date={date} rides={rides} />
      </div>
    </FullPageContent>
  )
};
