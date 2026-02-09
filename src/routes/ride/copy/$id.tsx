import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { MainContent } from "@/components/Layout/MainContent";
import { useRide } from "@/hooks/useRides";
import { useSession } from "@/hooks/useSession";
import { type RideFormProps } from "@/components/forms/RideForm";

const RideForm = lazy<React.ComponentType<RideFormProps>>(
  () => import("@/components/forms/RideForm"),
);

export const Route = createFileRoute("/ride/copy/$id")({
  component: CopyRidePage,
});

function CopyRidePage() {
  const { id } = Route.useParams();
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

  const rideDateStr = ride.rideDate?.replace(" ", "T") ?? "";
  const rideDateTime = rideDateStr ? new Date(rideDateStr) : null;
  const time = rideDateTime
    ? `${String(rideDateTime.getUTCHours()).padStart(2, "0")}:${String(rideDateTime.getUTCMinutes()).padStart(2, "0")}`
    : "";
  const rideDate = rideDateStr.split("T")[0] ?? "";

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
    interval: 1,
    freq: 2,
  };

  return (
    <MainContent>
      <Suspense>
        <RideForm
          isRepeating={false}
          defaultValues={defaultValues}
          isAdmin={user?.role === "ADMIN"}
        />
      </Suspense>
    </MainContent>
  );
}
