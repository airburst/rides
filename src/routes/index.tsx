import { createFileRoute } from "@tanstack/react-router";
import { MainContent } from "@/components/Layout/MainContent";
import { RidesListClient } from "@/components/RidesList/RidesListClient";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <MainContent>
      <RidesListClient />
    </MainContent>
  );
}
