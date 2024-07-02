import { BackButton } from "@/components/Button";
import { MainContent } from "@/components/Layout/MainContent";
import { RideDetails } from "@/components/RideDetails";
import { env } from "@/env";
import { getRide } from "@/server/actions/get-ride";
import { getServerAuthSession } from "@/server/auth";
import { type Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} Ride Details`,
}

export default async function RideDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const session = await getServerAuthSession();
  const user = session?.user;

  if (!id) {
    return (
      <MainContent>
        <>
          <div className="flex h-64 w-full items-center justify-center text-2xl">
            This ride is no longer available
          </div>
          <div className="flex mb-16 flex-row justify-between px-2 pt-8 sm:px-0">
            <BackButton />
          </div>
        </>
      </MainContent>
    );
  }

  // TODO: Move this into RSC
  const { ride, error } = await getRide(id);

  if (error) {
    return <MainContent>
      <div>{error.message}</div>
    </MainContent>
  }

  return (
    <MainContent>
      <RideDetails ride={ride!} user={user} role={user?.role} />
    </MainContent>
  )
};