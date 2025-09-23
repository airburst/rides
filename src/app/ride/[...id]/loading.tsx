import { MainContent } from "@/components/Layout/MainContent";
import { RideDetailsSkeleton } from "@/components/RideDetails/RideDetailsSkeleton";
import { env } from "@/env";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} Ride Details`,
}

export default async function RideDetailsPageLoading() {

  return (
    <MainContent>
      <RideDetailsSkeleton />
    </MainContent>
  )
};