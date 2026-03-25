import { useSession } from "@/hooks/useSession";
import { Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { FilterButton } from "../Filters";
const Logo = "/static/images/bath-cc-logo.svg";

const UserMenu = lazy(() => import("../UserMenu"));

const CLUB_SHORT_NAME = import.meta.env.VITE_CLUB_SHORT_NAME;

export const Header = () => {
  const { isAuthenticated } = useSession();

  return (
    <div className="fixed flex h-16 w-full items-center justify-center sm:h-24 z-20 backdrop-blur-xl">
      <div className="container flex w-full flex-row justify-between px-2 md:px-4 lg:max-w-5xl">
        <div className=" text-4xl tracking-wide sm:text-5xl">
          <Link
            to="/"
            title="Home"
            aria-label="Back to rides page"
            className="flex items-center gap-4"
          >
            <img
              className="hidden h-16 w-16 sm:block"
              src={Logo}
              alt="Bath Cycling Club Logo"
            />
            {CLUB_SHORT_NAME} Rides
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && <FilterButton />}
          <Suspense>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
