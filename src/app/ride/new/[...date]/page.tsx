"use client";

import { type RideFormProps } from "@/components/forms/RideForm";
import { MainContent } from "@/components/Layout/MainContent";
import { useSession } from "@/hooks/useSession";
import { formatFormDate, rruleDay } from "@utils/dates";
import { formatUserName } from "@utils/rides";
import dynamic from "next/dynamic";
import { use } from "react";

const RideForm = dynamic<RideFormProps>(
  () => import("@/components/forms/RideForm"),
);

export default function NewRidePageWithDate(props: {
  params: Promise<{ date?: string }>;
}) {
  const params = use(props.params);
  const { session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";
  const dateString = params.date ?? "";

  const defaultValues = {
    name: "",
    rideDate: dateString,
    time: "08:30",
    rideGroup: "",
    destination: "",
    meetPoint: "Brunel Square",
    distance: 0,
    leader: user?.name ? formatUserName(user.name) : "",
    route: "",
    notes: "",
    rideLimit: -1,
    // Repeats
    interval: 1,
    freq: 2, // Weekly
    startDate: formatFormDate(),
    endDate: "",
    until: undefined,
    winterStartTime: "08:30", // Update when time changes
    byweekday: rruleDay(), // Only set if displayed!
    bysetpos: rruleDay(), // Only set if displayed!
    bymonthday: undefined, // Only set if displayed!
  };

  return (
    <MainContent>
      <RideForm
        isRepeating={false}
        defaultValues={defaultValues}
        isAdmin={isAdmin}
      />
    </MainContent>
  );
}
