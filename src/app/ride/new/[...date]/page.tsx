import { MainContent } from "@/components/Layout/MainContent";
import { RideForm } from "@/components/forms/RideForm";
import { env } from "@/env";
import { canUseAction, getServerAuthSession } from "@/server/auth";
import { formatFormDate, rruleDay } from "@utils/dates";
import { formatUserName } from "@utils/rides";
import { type Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} User Profile Page`,
}

export default async function NewRidePageWithDate({ params }: { params: { date?: string } }) {
  const session = await getServerAuthSession();
  const user = session?.user;
  const isAdmin = await canUseAction("ADMIN");
  const dateString = params.date ?? "";

  const defaultValues = {
    name: "",
    rideDate: dateString,
    time: "08:30",
    rideGroup: "",
    destination: "",
    meetPoint: "Brunel Square",
    distance: 0,
    leader: formatUserName(user!.name),
    route: "",
    notes: "",
    rideLimit: -1,
    // Repeats
    interval: 1,
    freq: 2, // Weekly
    startDate: formatFormDate(),
    endDate: "",
    until: undefined,
    winterStartTime: "08:30", // Update when time changes
    byweekday: rruleDay(), // Only set if displayed!
    bysetpos: rruleDay(), // Only set if displayed!
    bymonthday: undefined, // Only set if displayed!
  };

  return (
    <MainContent>
      <RideForm
        isRepeating={false}
        defaultValues={defaultValues}
        isAdmin={!!isAdmin} />
    </MainContent>
  )
};