import { MainContent } from "@/components/Layout/MainContent";
import { RideForm } from "@/components/forms/RideForm";
import { env } from "@/env";
import { getRide } from "@/server/actions/get-ride";
import { canUseAction } from "@/server/auth";
import { flattenQuery } from "@utils/general";
import { type Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} User Profile Page`,
}

export default async function EditRidePage({ params }: { params: { id: string } }) {
  const id = flattenQuery(params.id);
  const isAdmin = await canUseAction("ADMIN");

  if (!isAdmin) {
    return (
      <MainContent>
        <h1>Not authorised</h1>
      </MainContent>
    )
  }

  // TODO: preferences
  const { ride, error } = await getRide(id);

  if (error) {
    return (
      <MainContent>
        <h1>Error fetching ride</h1>
      </MainContent>
    )
  }

  const defaultValues = {
    id,
    name: ride?.name ?? "",
    rideDate: ride?.rideDate ?? "",
    time: ride?.time ?? "",
    rideGroup: ride?.rideGroup ?? "",
    destination: ride?.destination ?? "",
    meetPoint: ride?.meetPoint ?? "",
    distance: +(ride?.distance ?? 0),
    leader: ride?.leader ?? "",
    route: ride?.route ?? "",
    notes: ride?.notes ?? "",
    rideLimit: +(ride?.rideLimit ?? -1),
    // Repeats
    interval: 1,
    freq: 2, // Weekly
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