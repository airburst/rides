import { BackButton } from "@/components/Button";
import { MainContent } from "@/components/Layout/MainContent";
import { UserProfileForm } from "@/components/forms/UserProfileForm";
import { env } from "@/env";
import { getUser } from "@/server/actions/get-user";
import { getServerAuthSession } from "@/server/auth";
import { type Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} User Profile Page`,
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const session = await getServerAuthSession();
  const userId = id ?? session?.user!.id;

  if (!userId) {
    return (
      <MainContent>
        <>
          <div className="flex h-64 w-full items-center justify-center text-2xl">
            Unable to find user details
          </div>
          <div className="flex h-4 flex-row justify-between px-2 pt-8 sm:px-0">
            <BackButton />
          </div>
        </>
      </MainContent>
    );
  }

  const { user, error } = await getUser(userId);

  if (error ?? !user) {
    return <MainContent>
      <div>{error?.message}</div>
    </MainContent>
  }

  return (
    <MainContent>
      <UserProfileForm user={user} />
    </MainContent>
  )
};