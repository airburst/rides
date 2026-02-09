import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import { MainContent } from "@/components/Layout/MainContent";
import { useRepeatingRide } from "@/hooks/repeating-rides";
import { useSession } from "@/hooks/useSession";

const RepeatingRideDetails = lazy(
  () => import("@/components/RepeatingRides/RepeatingRideDetails"),
);

export const Route = createFileRoute("/repeating-rides/$id")({
  component: RepeatingRidePage,
});

function RepeatingRidePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { session, isLoading: authLoading } = useSession();
  const isLeader =
    session?.user?.role === "LEADER" || session?.user?.role === "ADMIN";

  const { data: ride, isLoading, error } = useRepeatingRide(id ?? "");

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
      <Suspense>
        <RepeatingRideDetails ride={ride} />
      </Suspense>
    </MainContent>
  );
}
