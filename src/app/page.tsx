import { MainContent } from "@/components/Layout/MainContent";
import { RidesListClient } from "@/components/RidesList/RidesListClient";
import { UnregisterServiceWorkers } from "@/components/UnregisterServiceWorkers";
import { env } from "@/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} Ride Planner`,
};

export default function HomePage() {
  return (
    <>
      <MainContent>
        <RidesListClient />
      </MainContent>
      <UnregisterServiceWorkers />
    </>
  );
}
