import { MainContent } from "@/components/Layout/MainContent";
import { type RidesListProps } from "@/components/RidesList";
import { env } from "@/env";
import type { Metadata } from 'next';
import dynamic from "next/dynamic";

const RidesList = dynamic<RidesListProps>(() => import('@/components/RidesList'));

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} Ride Planner`,
}

export default async function HomePage() {
  return (
    <MainContent>
      <RidesList />
    </MainContent>
  );
}
