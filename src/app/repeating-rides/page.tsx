import { MainContent } from "@/components/Layout/MainContent";
import { RepeatingRidesList } from "@/components/RepeatingRides/RepeatingRidesList";
import { env } from "@/env";
import { getRepeatingRides } from "@/server/actions/get-repeating-rides";
import { canUseAction } from "@/server/auth";
import { type Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Manage Repeating Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} - Repeating Rides`,
}

export default async function Users() {
  const isAdmin = await canUseAction("ADMIN");

  // Redirect if not admin
  if (!isAdmin) {
    redirect("/");
  }

  const { rides, error } = await getRepeatingRides();

  if (error) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
        <div className="flex h-full items-center p-8 pt-32 text-2xl">
          Error loading rides
        </div>
      </div>
    );
  }

  return (
    <MainContent>
      <>
        <div className="w-full text-neutral-800">
          <div className="flex w-full flex-row items-center justify-center bg-primary p-2 font-bold uppercase tracking-wide text-white sm:rounded mb-4">
            Manage Repeating Rides
          </div>
        </div>
        <RepeatingRidesList repeatingRides={rides} />
      </>
    </MainContent>
  );
}
