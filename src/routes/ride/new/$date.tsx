import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { MainContent } from "@/components/Layout/MainContent";
import { useSession } from "@/hooks/useSession";
import { formatFormDate, rruleDay } from "@utils/dates";
import { formatUserName } from "@utils/rides";
import { type RideFormProps } from "@/components/forms/RideForm";

const RideForm = lazy<React.ComponentType<RideFormProps>>(
  () => import("@/components/forms/RideForm"),
);

export const Route = createFileRoute("/ride/new/$date")({
  component: NewRidePageWithDate,
});

function NewRidePageWithDate() {
  const { date } = Route.useParams();
  const { session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";

  const defaultValues = {
    name: "",
    rideDate: date ?? "",
    time: "08:30",
    rideGroup: "",
    destination: "",
    meetPoint: "Brunel Square",
    distance: 0,
    leader: user?.name ? formatUserName(user.name) : "",
    route: "",
    notes: "",
    rideLimit: -1,
    interval: 1,
    freq: 2,
    startDate: formatFormDate(),
    endDate: "",
    until: undefined,
    winterStartTime: "08:30",
    byweekday: rruleDay(),
    bysetpos: rruleDay(),
    bymonthday: undefined,
  };

  return (
    <MainContent>
      <Suspense>
        <RideForm
          isRepeating={false}
          defaultValues={defaultValues}
          isAdmin={isAdmin}
        />
      </Suspense>
    </MainContent>
  );
}
