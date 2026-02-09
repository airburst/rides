import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import { MainContent } from "@/components/Layout/MainContent";
import { useSession } from "@/hooks/useSession";
import { useUsers } from "@/hooks/users";

const UsersList = lazy(() => import("@/components/Users/UsersList"));

export const Route = createFileRoute("/users")({
  component: Users,
});

function Users() {
  const navigate = useNavigate();
  const { session, isLoading: authLoading } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const { data: users, isLoading, error } = useUsers();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      void navigate({ to: "/" });
    }
  }, [authLoading, isAdmin, navigate]);

  if (authLoading || isLoading) {
    return (
      <MainContent>
        <div className="flex h-64 w-full items-center justify-center">
          <span className="loading loading-spinner loading-lg" />
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
          Error loading users
        </div>
      </div>
    );
  }

  return (
    <MainContent>
      <>
        <div className="w-full text-neutral-800">
          <div className="mb-4 flex w-full flex-row items-center justify-center bg-primary p-2 font-bold uppercase tracking-wide text-white sm:rounded">
            Manage Users
          </div>
        </div>
        <Suspense>
          <UsersList users={users ?? []} />
        </Suspense>
      </>
    </MainContent>
  );
}
