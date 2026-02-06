"use client";

import { BackButton, Button } from "@/components/Button";
import { MainContent } from "@/components/Layout/MainContent";
import { type RidesListProps } from "@/components/RidesList";
import { useSession } from "@/hooks/useSession";
import { getNow } from "@utils/dates";
import { flattenQuery } from "@utils/general";
import { Plus } from "lucide-react";
import dynamicImport from "next/dynamic";
import Link from "next/link";
import { use } from "react";

const RidesList = dynamicImport<RidesListProps>(
  () => import("@/components/RidesList"),
);

export default function RidesOnDate(props: {
  params: Promise<{ date: string }>;
}) {
  const params = use(props.params);
  const { date } = params;
  const dateString = `${flattenQuery(date)}T01:00:00.000Z`;
  const isInFuture = dateString > getNow();
  const { session } = useSession();
  const isLeader =
    session?.user?.role === "LEADER" || session?.user?.role === "ADMIN";

  return (
    <MainContent>
      <>
        <RidesList date={date} />

        <div className="my-4 flex w-full flex-col gap-2 md:gap-4">
          <div className="m-2 flex flex-row justify-between gap-4 sm:mx-0 md:justify-start">
            <BackButton />
            {isLeader && isInFuture && (
              <Link href={`/ride/new/${date}`} prefetch={true}>
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
