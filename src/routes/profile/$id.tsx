import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import { BackButton } from "@/components/Button";
import { MainContent } from "@/components/Layout/MainContent";
import { Spinner } from "@/components/Spinner";
import { useSession } from "@/hooks/useSession";
import { useUser } from "@/hooks/users";

const UserProfileForm = lazy(
  () => import("@/components/forms/UserProfileForm"),
);

export const Route = createFileRoute("/profile/$id")({
  component: UserPage,
});

function UserPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { session, isLoading: authLoading } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const { data: user, isLoading, error } = useUser(id ?? "");

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

  if (!id) {
    return (
      <MainContent>
        <>
          <div className="flex h-64 w-full items-center justify-center text-2xl">
            Unable to find user details
          </div>
          <div className="mb-16 flex flex-row justify-between px-2 pt-8 sm:px-0">
            <BackButton />
          </div>
        </>
      </MainContent>
    );
  }

  if (error || !user) {
    return (
      <MainContent>
        <div className="flex h-64 w-full items-center justify-center text-2xl">
          Unable to load user
        </div>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <Suspense>
        <UserProfileForm user={user} isAdmin={isAdmin} />
      </Suspense>
    </MainContent>
  );
}
