import { MainContent } from "@/components/Layout/MainContent";
import { RidesListSkeleton } from "@/components/RidesList/RidesListSkeleton";

const LoadingRepeatingRides = () => {
  return <MainContent>
    <RidesListSkeleton
      numberOfCards={5}
      dateText="Manage Repeating Rides"
    />
  </MainContent>;
};

export default LoadingRepeatingRides;