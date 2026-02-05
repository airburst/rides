import { BackButton } from "@/components/Button";
import { MainContent } from "@/components/Layout/MainContent";
import { RideDetailsClient } from "@/components/RideDetails/RideDetailsClient";
import { env } from "@/env";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} Ride Details`,
};

export default async function RideDetailsPage(props: {
  params: Promise<{ id: string[] }>;
}) {
  const params = await props.params;
  const id = params.id?.[0];

  if (!id) {
    return (
      <MainContent>
        <>
          <div className="flex h-64 w-full items-center justify-center text-2xl">
            This ride is no longer available
          </div>
          <div className="mb-16 flex flex-row justify-between px-2 pt-8 sm:px-0">
            <BackButton />
          </div>
        </>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <RideDetailsClient id={id} />
    </MainContent>
  );
}
