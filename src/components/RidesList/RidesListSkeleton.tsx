import { CardSkeleton } from "../Card/CardSkeleton";
import { DateHeader } from "./DateHeader";

export type RidesListSkeletonProps = {
  dateText?: string;
  numberOfCards?: number;
};

const RidesListSkeleton = ({
  dateText = "SUNDAY 11 NOWONDER",
  numberOfCards = 5,
}: RidesListSkeletonProps) => (
  <div className="flex w-full flex-col items-start gap-4 mt-4">
    <DateHeader>{dateText}</DateHeader>
    {Array.from(Array(numberOfCards).keys()).map((key) => (
      <div key={key} className="w-full px-2 md:px-0 snap-start scroll-mt-20">
        <CardSkeleton />
      </div>
    ))}
  </div>
);

export default RidesListSkeleton;
