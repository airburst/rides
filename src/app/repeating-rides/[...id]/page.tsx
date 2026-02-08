"use client";

import { MainContent } from "@/components/Layout/MainContent";
import { useRepeatingRide } from "@/hooks/repeating-rides";
import { useSession } from "@/hooks/useSession";
import { flattenQuery } from "@utils/general";
import dynamicImport from "next/dynamic";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

const RepeatingRideDetails = dynamicImport(
  () => import("@/components/RepeatingRides/RepeatingRideDetails"),
);

export default function RepeatingRide(props: {
  params: Promise<{ id: string }>;
}) {
  const params = use(props.params);
  const id = flattenQuery(params.id);
  const router = useRouter();
  const { session, isLoading: authLoading } = useSession();
  const isLeader =
    session?.user?.role === "LEADER" || session?.user?.role === "ADMIN";

  const { data: ride, isLoading, error } = useRepeatingRide(id ?? "");

  // Redirect non-leaders
  useEffect(() => {
    if (!authLoading && !isLeader) {
      router.replace("/");
    }
  }, [authLoading, isLeader, router]);

  if (authLoading || isLoading) {
    return (
      <MainContent>
        <div className="flex h-64 w-full items-center justify-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      </MainContent>
    );
  }

  if (!isLeader) {
    return null; // Will redirect
  }

  if (error || !ride) {
    return (
      <MainContent>
        <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
          <div className="flex h-full items-center p-8 pt-32 text-2xl">
            Error loading ride
          </div>
        </div>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <RepeatingRideDetails ride={ride} />
    </MainContent>
  );
}
