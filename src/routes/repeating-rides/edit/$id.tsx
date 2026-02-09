import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import { MainContent } from "@/components/Layout/MainContent";
import { useRepeatingRide } from "@/hooks/repeating-rides";
import { useSession } from "@/hooks/useSession";
import { formatFormDate, getFormRideDateAndTime } from "@utils/dates";
import { flattenArrayNumber } from "@utils/forms";
import { type RideFormProps } from "@/components/forms/RideForm";

const RideForm = lazy<React.ComponentType<RideFormProps>>(
  () => import("@/components/forms/RideForm"),
);

export const Route = createFileRoute("/repeating-rides/edit/$id")({
  component: EditRepeatingRide,
});

function EditRepeatingRide() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { session, isLoading: authLoading } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const isLeader = isAdmin || session?.user?.role === "LEADER";

  const { data: repeatingRide, isLoading, error } = useRepeatingRide(id ?? "");

  useEffect(() => {
    if (!authLoading && !isLeader) {
      void navigate({ to: "/" });
    }
  }, [authLoading, isLeader, navigate]);

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
    return null;
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

  const { rideDate, startDate, time } = getFormRideDateAndTime(
    repeatingRide.startDate,
  );

  const defaultValues = {
    id,
    name: repeatingRide.name,
    freq: repeatingRide.freq,
    rideDate,
    startDate,
    endDate: repeatingRide.endDate
      ? formatFormDate(repeatingRide.endDate)
      : undefined,
    time,
    winterStartTime: repeatingRide.winterStartTime ?? "08:30",
    rideGroup: repeatingRide.rideGroup ?? "",
    destination: repeatingRide.destination ?? "",
    meetPoint: repeatingRide.meetPoint ?? "",
    notes: repeatingRide.notes ?? "",
    leader: repeatingRide.leader ?? "",
    route: repeatingRide.route ?? "",
    distance: repeatingRide.distance ?? 1,
    rideLimit: repeatingRide.rideLimit ?? -1,
    byweekday: flattenArrayNumber(repeatingRide.byweekday),
    bysetpos: flattenArrayNumber(repeatingRide.bysetpos),
    bymonthday: flattenArrayNumber(repeatingRide.bymonthday),
  };

  return (
    <MainContent>
      <Suspense>
        <RideForm defaultValues={defaultValues} isRepeating isAdmin={isAdmin} />
      </Suspense>
    </MainContent>
  );
}
