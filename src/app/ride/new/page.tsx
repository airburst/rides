// import { BackButton } from "@/components/Button";
import { MainContent } from "@/components/Layout/MainContent";
import { RideForm } from "@/components/forms/RideForm";
import { env } from "@/env";
import { formatFormDate, rruleDay } from "@utils/dates";
import { formatUserName } from "@utils/rides";
// import { getRide } from "@/server/actions/get-ride";
import { canUseAction, getServerAuthSession } from "@/server/auth";
import { type Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} User Profile Page`,
}

export default async function EditRidePage({ params }: { params: { id: string, date?: string } }) {
  // const { id } = params;
  const session = await getServerAuthSession();
  const user = session?.user;
  const isAdmin = await canUseAction("ADMIN");
  const dateString = params.date ?? "";
  const defaultFrequency = 2; // Weekly

  // if (!userId) {
  //   return (
  //     <MainContent>
  //       <>
  //         <div className="flex h-64 w-full items-center justify-center text-2xl">
  //           Unable to find user details
  //         </div>
  //         <div className="flex mb-16 flex-row justify-between px-2 pt-8 sm:px-0">
  //           <BackButton />
  //         </div>
  //       </>
  //     </MainContent>
  //   );
  // }

  // const { ride, error } = await getRide();

  // if (error ?? !user) {
  //   return <MainContent>
  //     <div>{error}</div>
  //   </MainContent>
  // }

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
    freq: defaultFrequency,
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