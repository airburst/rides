"use client";

import { BackButton } from "@/components/Button";
import { MainContent } from "@/components/Layout/MainContent";
import { useSession } from "@/hooks/useSession";
import { useUser } from "@/hooks/users";
import dynamic from "next/dynamic";

const UserProfileForm = dynamic(
  () => import("@/components/forms/UserProfileForm"),
);

export default function ProfilePage() {
  const { session, isLoading: authLoading } = useSession();
  const userId = session?.user?.id;

  const { data: user, isLoading, error } = useUser(userId ?? "");

  if (authLoading || isLoading) {
    return (
      <MainContent>
        <div className="flex h-64 w-full items-center justify-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      </MainContent>
    );
  }

  if (!userId) {
    return (
      <MainContent>
        <>
          <div className="flex h-64 w-full items-center justify-center text-2xl">
            Please sign in to view your profile
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
          Unable to load profile
        </div>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <UserProfileForm user={user} />
    </MainContent>
  );
}
