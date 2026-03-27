import { useSession } from "@/hooks/useSession";
import { Link } from "@tanstack/react-router";
import { Bike } from "lucide-react";
import { lazy, Suspense } from "react";
import { FilterButton } from "../Filters";
const Logo = "/static/images/bath-cc-logo.svg";

const UserMenu = lazy(() => import("../UserMenu"));

// const CLUB_SHORT_NAME = import.meta.env.VITE_CLUB_SHORT_NAME;

export const Header = () => {
  const { isAuthenticated } = useSession();

  return (
    <div className="sticky top-0 flex h-16 w-full items-center justify-center sm:h-24 z-20 backdrop-blur-xl bg-white/50 border-b border-gray-200">
      <div className="container flex w-full flex-row justify-between px-2 md:px-4 lg:max-w-5xl items-center">
        <div className=" text-4xl sm:text-5xl">
          <Link
            to="/"
            title="Home"
            aria-label="Back to rides page"
            className="flex items-center gap-2 lg:gap-4"
          >
            <img
              className="hidden h-16 w-16 sm:block"
              src={Logo}
              alt="Bath Cycling Club Logo"
            />
             <Bike size={32} className="sm:hidden"/>
            Rides
          </Link>
        </div>

        <div className="flex gap-4">
          {isAuthenticated && <FilterButton />}
          <Suspense>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
