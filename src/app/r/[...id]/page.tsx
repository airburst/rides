import { BackButton } from "@/components/Button";
import { MainContent } from "@/components/Layout/MainContent";
import { env } from "@/env";
import { getRideByShortId } from "@/server/actions/get-ride-by-shortid";
import { type Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} Ride Details`,
};

export default async function ShortIdPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;

  if (!id) {
    return (
      <MainContent>
        <div>
          <div className="flex h-64 w-full items-center justify-center text-2xl">
            This ride is no longer available
          </div>
          <div className="flex mb-16 flex-row justify-between px-2 pt-8 sm:px-0">
            <BackButton />
          </div>
        </div>
      </MainContent>
    );
  }

  // Get the full ride ID from short ID and redirect
  const { ride, error } = await getRideByShortId(id);

  if (error || !ride?.id) {
    return (
      <MainContent>
        <div>
          <div className="flex h-64 w-full items-center justify-center text-2xl">
            This ride is no longer available
          </div>
          <div className="flex mb-16 flex-row justify-between px-2 pt-8 sm:px-0">
            <BackButton />
          </div>
        </div>
      </MainContent>
    );
  }

  // Redirect to the full ride URL
  redirect(`/ride/${ride.id}`);
}
