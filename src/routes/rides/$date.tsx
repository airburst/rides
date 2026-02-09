import { BackButton, Button } from "@/components/Button";
import { MainContent } from "@/components/Layout/MainContent";
import { type RidesListClientProps } from "@/components/RidesList/RidesListClient";
import { useSession } from "@/hooks/useSession";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getNow } from "@utils/dates";
import { Plus } from "lucide-react";
import { lazy, Suspense } from "react";

const RidesList = lazy<React.ComponentType<RidesListClientProps>>(() =>
  import("@/components/RidesList/RidesListClient").then((m) => ({
    default: m.RidesListClient,
  })),
);

export const Route = createFileRoute("/rides/$date")({
  component: RidesOnDate,
});

function RidesOnDate() {
  const { date } = Route.useParams();
  const dateString = `${date}T01:00:00.000Z`;
  const isInFuture = dateString > getNow();
  const { session } = useSession();
  const isLeader =
    session?.user?.role === "LEADER" || session?.user?.role === "ADMIN";

  return (
    <MainContent>
      <>
        <Suspense>
          <RidesList date={date} />
        </Suspense>

        <div className="my-4 flex w-full flex-col gap-2 md:gap-4">
          <div className="m-2 grid grid-cols-2 md:grid-cols-4 gap-4 sm:mx-0">
            <BackButton />
            {isLeader && isInFuture && (
              <Link to="/ride/new/$date" params={{ date }}>
                <Button accent className="w-full">
                  <Plus className="h-8 w-8" />
                  <span>ADD RIDE</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </>
    </MainContent>
  );
}
