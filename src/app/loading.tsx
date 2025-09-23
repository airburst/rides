import { MainContent } from "@/components/Layout/MainContent";
import { type RidesListSkeletonProps } from "@/components/RidesList/RidesListSkeleton";
import dynamic from "next/dynamic";

const RidesListSkeleton = dynamic<RidesListSkeletonProps>(() => import('@/components/RidesList/RidesListSkeleton'));

const LoadingRides = () => {
  return <MainContent>
    <RidesListSkeleton
      numberOfCards={5}
      dateText="Loading rides..."
    />
  </MainContent>;
};

export default LoadingRides;