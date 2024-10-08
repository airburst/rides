import { MainContent } from "@/components/Layout/MainContent";
import { env } from "@/env";
import { getUsers } from "@/server/actions/get-users";
import { canUseAction } from "@/server/auth";
import { type Metadata } from "next";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const UsersList = dynamic(() => import("@/components/Users/UsersList"));

export const metadata: Metadata = {
  title: `Manage Users`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} - Users`,
}

export default async function Users() {
  const isAdmin = await canUseAction("ADMIN");

  // Redirect if not admin
  if (!isAdmin) {
    redirect("/");
  }

  const { users, error } = await getUsers();

  if (error) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
        <div className="flex h-full items-center p-8 pt-32 text-2xl">
          Error loading rides
        </div>
      </div>
    );
  }

  return (
    <MainContent>
      <>
        <div className="w-full text-neutral-800">
          <div className="flex w-full flex-row items-center justify-center bg-primary p-2 font-bold uppercase tracking-wide text-white sm:rounded mb-4">
            Manage Users
          </div>
        </div>
        <UsersList users={users} />
      </>
    </MainContent>
  );
}
