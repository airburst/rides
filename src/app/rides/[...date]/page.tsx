import { BackButton, Button } from "@/components/Button";
import { PlusIcon } from "@/components/Icon";
import { MainContent } from "@/components/Layout/MainContent";
import { RidesList } from "@/components/RidesList";
import { RidesListSkeleton } from "@/components/RidesList/RidesListSkeleton";
import { canUseAction } from "@/server/auth";
import { formatDate, getNow } from "@utils/dates";
import { flattenQuery } from "@utils/general";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function RidesOnDate({ params }: { params: { date: string } }) {
  const { date } = params;
  const dateString = `${flattenQuery(date)}T01:00:00.000Z`;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isInFuture = dateString > getNow();
  const isLeader = await canUseAction("LEADER")

  return (
    <MainContent>
      <>
        <Suspense fallback={<RidesListSkeleton
          numberOfCards={1}
          dateText={formatDate(dateString)}
        />}>
          <RidesList date={date} />
        </Suspense>

        <div className="flex w-full flex-col gap-2 md:gap-4 my-4">
          <div className="m-2 sm:mx-0 flex h-10 flex-row justify-between md:justify-start gap-4">
            <BackButton />
            {isLeader && isInFuture && (
              <Link href={`/ride/new?date=${date}`}>
                <Button accent>
                  <PlusIcon className="fill-white" />
                  <span>ADD RIDE</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </>
    </MainContent>
  );
}
