import { MainContent } from "@/components/Layout/MainContent";
import { RidesListSkeleton } from "@/components/RidesList/RidesListSkeleton";

const LoadingRides = () => {
  return <MainContent>
    <RidesListSkeleton />
  </MainContent>;
};

export default LoadingRides;