import { BackButton } from "@/components/Button";
import { MainContent } from "@/components/Layout/MainContent";
import { UserProfileForm } from "@/components/forms/UserProfileForm";
import { env } from "@/env";
import { getUser } from "@/server/actions/get-user";
import { canUseAction } from "@/server/auth";
import { type Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} User Profile Page`,
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const isAdmin = await canUseAction("ADMIN");

  // Redirect if not admin
  if (!isAdmin) {
    redirect("/");
  }

  if (!id) {
    return (
      <MainContent>
        <>
          <div className="flex h-64 w-full items-center justify-center text-2xl">
            Unable to find user details
          </div>
          <div className="flex mb-16 flex-row justify-between px-2 pt-8 sm:px-0">
            <BackButton />
          </div>
        </>
      </MainContent>
    );
  }

  const { user, error } = await getUser(id);

  if (error ?? !user) {
    return <MainContent>
      <div>{error}</div>
    </MainContent>
  }

  return (
    <MainContent>
      <UserProfileForm user={user} isAdmin={isAdmin} />
    </MainContent>
  )
};