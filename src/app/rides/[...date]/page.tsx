import { MainContent, RidesList, RidesListSkeleton } from "@/components";
import { formatDate, getNow } from "@utils/dates";
import { flattenQuery } from "@utils/general";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function RidesOnDate({ params }: { params: { date: string } }) {
  const { date } = params;
  const dateString = `${flattenQuery(date)}T01:00:00.000Z`;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isInFuture = dateString > getNow();

  return (
    <MainContent>
      <Suspense fallback={<RidesListSkeleton
        numberOfCards={1}
        dateText={formatDate(dateString)}
      />}>
        <RidesList date={date} />
      </Suspense>
    </MainContent>
  );
}
