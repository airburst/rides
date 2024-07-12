import { MainContent } from "@/components/Layout/MainContent";
import { RepeatingRideDetailsSkeleton } from "@/components/RepeatingRides/RepeatingRideDetailsSkeleton";

const LoadingRepeatingRides = () => {
  return <MainContent>
    <RepeatingRideDetailsSkeleton />
  </MainContent>;
};

export default LoadingRepeatingRides;