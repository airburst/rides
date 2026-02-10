import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { BackButton } from "@/components/Button";
import { MainContent } from "@/components/Layout/MainContent";
import { RideDetailsSkeleton } from "@/components/RideDetails/RideDetailsSkeleton";
import { useRideByShortId } from "@/hooks/rides/useRideByShortId";

export const Route = createFileRoute("/r/$id")({
  component: ShortUrlRedirect,
  pendingComponent: () => (
    <MainContent>
      <RideDetailsSkeleton />
    </MainContent>
  ),
});

function ShortUrlRedirect() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: ride, isLoading, isError, error } = useRideByShortId(id);

  useEffect(() => {
    if (ride?.id) {
      navigate({ to: "/ride/$id", params: { id: ride.id } });
    }
  }, [ride, navigate]);

  if (isLoading) {
    return (
      <MainContent>
        <RideDetailsSkeleton />
      </MainContent>
    );
  }

  if (isError || !ride) {
    return (
      <MainContent>
        <>
          <div className="flex h-64 w-full items-center justify-center text-2xl">
            {error instanceof Error
              ? "This ride is no longer available"
              : "Ride not found"}
          </div>
          <div className="mb-16 flex flex-row justify-between px-2 pt-8 sm:px-0">
            <BackButton />
          </div>
        </>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <RideDetailsSkeleton />
    </MainContent>
  );
}
