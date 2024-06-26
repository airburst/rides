import { MainContent } from "@/components/Layout/MainContent";
import { UsersList } from "@/components/Users/UsersList";
import { env } from "@/env";
import { canUseAction } from "@/server/auth";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

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

  return (
    <MainContent>
      <>
        <div className="w-full text-neutral-800">
          <div className="flex w-full flex-row items-center justify-center bg-primary p-2 font-bold uppercase tracking-wide text-white sm:rounded mb-4">
            Manage Users
          </div>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <UsersList query="air" />
        </Suspense>
      </>
    </MainContent>
  );
}
