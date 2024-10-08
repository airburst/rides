import { BackButton, Button } from "@/components/Button";
import { MainContent } from "@/components/Layout/MainContent";
import { type RidesListProps } from "@/components/RidesList";
import { canUseAction } from "@/server/auth";
import { getNow } from "@utils/dates";
import { flattenQuery } from "@utils/general";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const RidesList = dynamic<RidesListProps>(() => import('@/components/RidesList'));

export default async function RidesOnDate({ params }: { params: { date: string } }) {
  const { date } = params;
  const dateString = `${flattenQuery(date)}T01:00:00.000Z`;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isInFuture = dateString > getNow();
  const isLeader = await canUseAction("LEADER")

  return (
    <MainContent>
      <>
        <RidesList date={date} />

        <div className="flex w-full flex-col gap-2 md:gap-4 my-4">
          <div className="m-2 sm:mx-0 flex h-10 flex-row justify-between md:justify-start gap-4">
            <BackButton />
            {isLeader && isInFuture && (
              <Link href={`/ride/new/${date}`} prefetch={false}>
                <Button accent>
                  <Plus className="h-8 w-8" />
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
