import { BackButton, MainContent, RideDetails } from "@/components";
import { env } from "@/env";
import { getRide } from "@/server/db/queries/getRide";
import { type Preferences, type Role } from "@/types";
import { type Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} Ride Details`,
}

const MOCK_USER = {
  "id": "e0f7a8ce-8f75-44f8-9bec-8864c8fe42b2",
  "name": "Mark Fairhurst",
  "email": "mark1@gmail.com",
  "image": "https://gravatar.com/avatar/c8776163654aa56a6819781cad028020?size=40",
  "mobile": "07770 123456",
  "emergency": "Partner 07770 987654",
  "role": "ADMIN" as Role,
  "preferences": { "units": "km" } as Preferences
}

export default async function RideDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return (
      <MainContent>
        <>
          <div className="flex h-64 w-full items-center justify-center text-2xl">
            This ride is no longer available
          </div>
          <div className="flex h-4 flex-row justify-between px-2 pt-8 sm:px-0">
            <BackButton />
          </div>
        </>
      </MainContent>
    );
  }

  const { ride, error } = await getRide(id);

  // if (loading) {
  //   return <RideDetailsSkeleton />;
  // }

  if (error) {
    return <MainContent>
      <div>{error.message}</div>
    </MainContent>
  }

  return (
    <MainContent>
      <RideDetails ride={ride!} user={MOCK_USER} role={MOCK_USER.role} />
    </MainContent>
  )
};