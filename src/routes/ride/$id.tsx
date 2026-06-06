import { BackButton } from "@/components/Button";
import { MainContent } from "@/components/Layout/MainContent";
import { PWARedirectBanner } from "@/components/PWARedirectBanner";
import { RideDetailsClient } from "@/components/RideDetails/RideDetailsClient";
import { RideDetailsSkeleton } from "@/components/RideDetails/RideDetailsSkeleton";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ride/$id")({
  component: RideDetailsPage,
  pendingComponent: () => (
    <MainContent>
      <RideDetailsSkeleton />
    </MainContent>
  ),
});

function RideDetailsPage() {
  const { id } = Route.useParams();

  if (!id) {
    return (
      <MainContent>
        <>
          <div className="flex h-64 w-full items-center justify-center text-2xl">
            This ride is no longer available
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
      <>
        <PWARedirectBanner
          targetPath={`/ride/${id}`}
          dismissKey={`pwa-banner-ride-${id}`}
        />
        <RideDetailsClient id={id} />
      </>
    </MainContent>
  );
}
