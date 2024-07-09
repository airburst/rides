import { MainContent } from "@/components/Layout/MainContent";
import { RepeatingRideDetailsSkeleton } from "@/components/RepeatingRides/RepeatingRideDetailsSkeleton";

export default async function RepeatingRide() {
  return (
    <MainContent>
      <RepeatingRideDetailsSkeleton />
    </MainContent>
  );
}
