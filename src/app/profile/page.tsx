import { BackButton, MainContent } from "@/components";
import { env } from "@/env";
import { getServerAuthSession } from "@/server/auth";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} User Profile Page`,
}

// TODO: Add auth guard

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
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

  const session = await getServerAuthSession()
  console.log("🚀 ~ session:", session)

  // const { user, error } = await getUser(id);

  // if (error) {
  //   return <MainContent>
  //     <div>{error.message}</div>
  //   </MainContent>
  // }

  return (
    <MainContent>
      <div>TODO: Fetch user profile</div>
    </MainContent>
  )
};