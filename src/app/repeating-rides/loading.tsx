import { MainContent } from "@/components/Layout/MainContent";
import RepeatingRidesListSkeleton from "@/components/RepeatingRides/RepeatingRidesListSkeleton";

const LoadingRepeatingRides = () => {
  return <MainContent>
    <RepeatingRidesListSkeleton />
  </MainContent>;
};

export default LoadingRepeatingRides;