import { MainContent } from "@/components/Layout/MainContent";
import { getRepeatingRide } from "@/server/actions/get-repeating-ride";
import { canUseAction } from "@/server/auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const RepeatingRideDetails = dynamic(() => import("@/components/RepeatingRides/RepeatingRideDetails"));

export default async function RepeatingRide({ params }: { params: { id: string } }) {
  const { id } = params;
  const isAdmin = await canUseAction("ADMIN");

  // Redirect if not admin
  if (!isAdmin) {
    redirect("/");
  }

  const { ride, error } = await getRepeatingRide(id);

  if (error ?? !ride) {
    return (
      <MainContent>
        <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
          <div className="flex h-full items-center p-8 pt-32 text-2xl">
            Error loading ride
          </div>
        </div>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <RepeatingRideDetails ride={ride} />
    </MainContent>
  );
}
