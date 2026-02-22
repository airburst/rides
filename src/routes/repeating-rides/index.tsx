import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import { MainContent } from "@/components/Layout/MainContent";
import { Spinner } from "@/components/Spinner";
import { useRepeatingRides } from "@/hooks/repeating-rides";
import { useSession } from "@/hooks/useSession";

const RepeatingRidesList = lazy(
  () => import("@/components/RepeatingRides/RepeatingRidesList"),
);

export const Route = createFileRoute("/repeating-rides/")({
  component: RepeatingRides,
});

function RepeatingRides() {
  const navigate = useNavigate();
  const { session, isLoading: authLoading } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const { data: rides, isLoading, error } = useRepeatingRides();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      void navigate({ to: "/" });
    }
  }, [authLoading, isAdmin, navigate]);

  if (authLoading || isLoading) {
    return (
      <MainContent>
        <div className="flex h-64 w-full items-center justify-center">
          <Spinner />
        </div>
      </MainContent>
    );
  }

  if (!isAdmin) {
    return null;
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
        <Suspense>
          <RepeatingRidesList repeatingRides={rides ?? []} />
        </Suspense>
      </>
    </MainContent>
  );
}
