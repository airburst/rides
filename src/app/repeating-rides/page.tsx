"use client";

import { MainContent } from "@/components/Layout/MainContent";
import { useRepeatingRides } from "@/hooks/repeating-rides";
import { useSession } from "@/hooks/useSession";
import dynamicImport from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RepeatingRidesList = dynamicImport(
  () => import("@/components/RepeatingRides/RepeatingRidesList"),
);

export default function RepeatingRides() {
  const router = useRouter();
  const { session, isLoading: authLoading } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const { data: rides, isLoading, error } = useRepeatingRides();

  // Redirect non-admins
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace("/");
    }
  }, [authLoading, isAdmin, router]);

  if (authLoading || isLoading) {
    return (
      <MainContent>
        <div className="flex h-64 w-full items-center justify-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      </MainContent>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect
  }

  if (error) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
        <div className="flex h-full items-center p-8 pt-32 text-2xl">
          Error loading rides
        </div>
      </div>
    );
  }

  return (
    <MainContent>
      <>
        <div className="w-full text-neutral-800">
          <div className="mb-4 flex w-full flex-row items-center justify-center bg-primary p-2 font-bold uppercase tracking-wide text-white sm:rounded">
            Manage Repeating Rides
          </div>
        </div>
        <RepeatingRidesList repeatingRides={rides ?? []} />
      </>
    </MainContent>
  );
}
