import { type RideFormProps } from "@/components/forms/RideForm";
import { MainContent } from "@/components/Layout/MainContent";
import { env } from "@/env";
import { getRide } from "@/server/actions/get-ride";
import { canUseAction } from "@/server/auth";
import { flattenQuery } from "@utils/general";
import { type Metadata } from "next";

import dynamic from "next/dynamic";

const RideForm = dynamic<RideFormProps>(() => import("@/components/forms/RideForm"));

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
}

export default async function CopyRidePage({ params }: { params: { id: string } }) {
  const id = flattenQuery(params.id);
  const isAdmin = await canUseAction("ADMIN");
  const isLeader = await canUseAction("LEADER");

  if (!isLeader) {
    return (
      <MainContent>
        <h1>Not authorised</h1>
      </MainContent>
    )
  }

  const { ride, error } = await getRide(id);

  if (error) {
    return (
      <MainContent>
        <h1>Error fetching ride</h1>
      </MainContent>
    )
  }

  const defaultValues = {
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