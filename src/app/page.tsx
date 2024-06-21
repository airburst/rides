import { MainContent, RidesList, RidesListSkeleton } from "@/components";
import { env } from "@/env";
import type { Metadata } from 'next';
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} Ride Planner`,
}


export default async function HomePage() {
  return (
    <MainContent>
      <Suspense fallback={<RidesListSkeleton />}>
        <RidesList />
      </Suspense>
    </MainContent>
  );
}
