"use client";

import { type RideFormProps } from "@/components/forms/RideForm";
import { MainContent } from "@/components/Layout/MainContent";
import { useRide } from "@/hooks/useRides";
import { useSession } from "@/hooks/useSession";
import { flattenQuery } from "@utils/general";
import dynamic from "next/dynamic";
import { use } from "react";

const RideForm = dynamic<RideFormProps>(
  () => import("@/components/forms/RideForm"),
);

export default function CopyRidePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = use(props.params);
  const id = flattenQuery(params.id);
  const { session } = useSession();
  const user = session?.user;
  const isLeaderOrAdmin = user?.role === "LEADER" || user?.role === "ADMIN";

  const { data: ride, isLoading, error } = useRide(id);

  if (!isLeaderOrAdmin) {
    return (
      <MainContent>
        <h1>Not authorised</h1>
      </MainContent>
    );
  }

  if (isLoading) {
    return (
      <MainContent>
        <div className="p-8">Loading...</div>
      </MainContent>
    );
  }

  if (error || !ride) {
    return (
      <MainContent>
        <h1>Error fetching ride</h1>
      </MainContent>
    );
  }

  // Extract date and time from rideDate (format: "2026-02-09 10:30:00" or ISO)
  const rideDateStr = ride.rideDate?.replace(" ", "T") ?? "";
  const rideDateTime = rideDateStr ? new Date(rideDateStr) : null;
  const time = rideDateTime
    ? `${String(rideDateTime.getUTCHours()).padStart(2, "0")}:${String(rideDateTime.getUTCMinutes()).padStart(2, "0")}`
    : "";
  const rideDate = rideDateStr.split("T")[0] ?? "";

  // Copy does NOT include id - creates a new ride
  const defaultValues = {
    name: ride.name ?? "",
    rideDate,
    time,
    rideGroup: ride.rideGroup ?? "",
    destination: ride.destination ?? "",
    meetPoint: ride.meetPoint ?? "",
    distance: +(ride.distance ?? 0),
    leader: ride.leader ?? "",
    route: ride.route ?? "",
    notes: ride.notes ?? "",
    rideLimit: +(ride.rideLimit ?? -1),
    // Repeats
    interval: 1,
    freq: 2, // Weekly
  };

  return (
    <MainContent>
      <RideForm
        isRepeating={false}
        defaultValues={defaultValues}
        isAdmin={user?.role === "ADMIN"}
      />
    </MainContent>
  );
}
