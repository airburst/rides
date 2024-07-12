import { env } from "@/env";
import { getServerAuthSession } from "@/server/auth";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/static/images/bath-cc-logo.svg";
import { FilterButton } from "../Filters";

const UserMenu = dynamic(() => import("../UserMenu"));

const { NEXT_PUBLIC_CLUB_SHORT_NAME } = env;

export const Header = async () => {
  const session = await getServerAuthSession()
  const user = session?.user;
  const isAuthenticated = !!user;
  const role = user?.role;

  return (
    <div className="fixed flex h-16 w-full items-center justify-center bg-primary text-white sm:h-24 z-20">
      <div className="container flex w-full flex-row justify-between px-2 md:px-4 lg:max-w-[1024px]">
        <div className=" text-4xl tracking-wide sm:text-5xl">
          <Link
            type="button"
            href="/"
            title="Home"
            aria-label="Back to rides page"
            className="flex items-center gap-4"
          >
            <Image
              className="hidden h-[64px] w-[64px] sm:block"
              src={Logo as string}
              alt="Bath Cycling Club Logo"
            />
            {NEXT_PUBLIC_CLUB_SHORT_NAME} Rides
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && <FilterButton />}
          <UserMenu
            isAuthenticated={isAuthenticated}
            role={role}
          />
        </div>
      </div>
    </div>
  );
};
