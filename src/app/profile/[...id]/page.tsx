"use client";

import { BackButton } from "@/components/Button";
import { MainContent } from "@/components/Layout/MainContent";
import { useSession } from "@/hooks/useSession";
import { useUser } from "@/hooks/users";
import { flattenQuery } from "@utils/general";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

const UserProfileForm = dynamic(
  () => import("@/components/forms/UserProfileForm"),
);

export default function UserPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const id = flattenQuery(params.id);
  const router = useRouter();
  const { session, isLoading: authLoading } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const { data: user, isLoading, error } = useUser(id ?? "");

  // Redirect non-admins
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace("/");
    }
  }, [authLoading, isAdmin, router]);

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
    return null; // Will redirect
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
      <UserProfileForm user={user} isAdmin={isAdmin} />
    </MainContent>
  );
}
