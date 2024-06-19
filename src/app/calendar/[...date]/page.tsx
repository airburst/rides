import { CalendarPage } from "@/components/Calendar/CalendarPage";
import { env } from "@/env";
import { type Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} Ride Calendar`,
}

export default async function RideCalendar({ params }: { params: { date: string } }) {
  const { date } = params;

  // TODO: add Suspense
  return (
    <CalendarPage date={date} />
  )
};
