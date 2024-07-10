import { MainContent } from "@/components/Layout/MainContent";
import { RidesListSkeleton } from "@/components/RidesList/RidesListSkeleton";

const LoadingRides = () => {
  return <MainContent>
    <RidesListSkeleton
      numberOfCards={5}
      dateText="Loading rides..."
    />
  </MainContent>;
};

export default LoadingRides;