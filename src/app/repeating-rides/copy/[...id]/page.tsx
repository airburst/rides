"use client";

import { type RideFormProps } from "@/components/forms/RideForm";
import { MainContent } from "@/components/Layout/MainContent";
import { useRepeatingRide } from "@/hooks/repeating-rides";
import { useSession } from "@/hooks/useSession";
import { formatFormDate, getNow } from "@utils/dates";
import { flattenArrayNumber } from "@utils/forms";
import { flattenQuery } from "@utils/general";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

const RideForm = dynamic<RideFormProps>(
  () => import("@/components/forms/RideForm"),
);

export default function CopyRepeatingRide(props: {
  params: Promise<{ id: string }>;
}) {
  const params = use(props.params);
  const id = flattenQuery(params.id);
  const router = useRouter();
  const { session, isLoading: authLoading } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const isLeader = isAdmin || session?.user?.role === "LEADER";

  const { data: repeatingRide, isLoading, error } = useRepeatingRide(id ?? "");

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

  if (error || !repeatingRide) {
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

  const rideDate = formatFormDate(getNow()).split("T")[0]!;
  const startDate = repeatingRide.startDate.split("T")[0];
  const time =
    repeatingRide.startDate.split("T")[1]?.substring(0, 5) ?? "08:30";

  const defaultValues = {
    name: repeatingRide.name,
    freq: repeatingRide.freq,
    rideDate,
    startDate,
    endDate: repeatingRide.endDate
      ? formatFormDate(repeatingRide.endDate)
      : undefined,
    time,
    winterStartTime: time,
    rideGroup: repeatingRide.rideGroup ?? "",
    destination: repeatingRide.destination ?? "",
    meetPoint: repeatingRide.meetPoint ?? "",
    notes: repeatingRide.notes ?? "",
    leader: repeatingRide.leader ?? "",
    route: repeatingRide.route ?? "",
    distance: repeatingRide.distance ?? 1,
    rideLimit: repeatingRide.rideLimit ?? -1,
    // Flatten arrays to scalars
    byweekday: flattenArrayNumber(repeatingRide.byweekday),
    bysetpos: flattenArrayNumber(repeatingRide.bysetpos),
    bymonthday: flattenArrayNumber(repeatingRide.bymonthday),
  };

  return (
    <MainContent>
      <RideForm defaultValues={defaultValues} isRepeating isAdmin={isAdmin} />
    </MainContent>
  );
}
