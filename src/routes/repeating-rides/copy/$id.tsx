import { type RideFormProps } from "@/components/forms/RideForm";
import { MainContent } from "@/components/Layout/MainContent";
import { Spinner } from "@/components/Spinner";
import { useRepeatingRideFormDefaults } from "@/hooks/repeating-rides";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";

const RideForm = lazy<React.ComponentType<RideFormProps>>(
  () => import("@/components/forms/RideForm"),
);

export const Route = createFileRoute("/repeating-rides/copy/$id")({
  component: CopyRepeatingRide,
});

function CopyRepeatingRide() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { defaultValues, isLoading, error, isLeaderOrAdmin, isAdmin } =
    useRepeatingRideFormDefaults(id ?? "", "copy");

  useEffect(() => {
    if (!isLoading && !isLeaderOrAdmin) {
      void navigate({ to: "/" });
    }
  }, [isLoading, isLeaderOrAdmin, navigate]);

  if (isLoading) {
    return (
      <MainContent>
        <div className="flex h-64 w-full items-center justify-center">
          <Spinner />
        </div>
      </MainContent>
    );
  }

  if (!isLeaderOrAdmin) {
    return null;
  }

  if (error || !defaultValues) {
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
      <Suspense>
        <RideForm defaultValues={defaultValues} isRepeating isAdmin={isAdmin} />
      </Suspense>
    </MainContent>
  );
}
