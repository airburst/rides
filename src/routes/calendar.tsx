import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/calendar")({
  component: CalendarLayout,
});

function CalendarLayout() {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
}
