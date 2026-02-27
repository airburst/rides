import { type RideFormProps } from "@/components/forms/RideForm";
import { MainContent } from "@/components/Layout/MainContent";
import { useRideFormDefaults } from "@/hooks/rides";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const RideForm = lazy<React.ComponentType<RideFormProps>>(
  () => import("@/components/forms/RideForm"),
);

export const Route = createFileRoute("/ride/edit/$id")({
  component: EditRidePage,
});

function EditRidePage() {
  const { id } = Route.useParams();
  const { defaultValues, isLoading, error, isLeaderOrAdmin, isAdmin } =
    useRideFormDefaults(id, "edit");

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

  if (error || !defaultValues) {
    return (
      <MainContent>
        <h1>Error fetching ride</h1>
      </MainContent>
    );
  }

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
