"use client";
import { env } from "@/env";
import { useAtom } from "jotai";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Logo from "../../public/static/images/bath-cc-logo.svg";
import { filterQueryAtom, showFilterAtom } from "../store";
import { FilterIcon, FilterSelectedIcon } from "./Icon";
import { UserMenu } from "./UserMenu";

const { NEXT_PUBLIC_CLUB_SHORT_NAME } = env;



type Props = {
  isAuthenticated: boolean;
  role: string;
};

export const Header = ({ isAuthenticated, role }: Props) => {
  const [, setShowFilterMenu] = useAtom(showFilterAtom);
  const [filterQuery] = useAtom(filterQueryAtom);
  const router = useRouter();
  const params = useParams();
  const rideId = params.id;
  const isRidesPage = params.pathname === "/";

  const goHome = () => router.push("/");

  const showFilters = () => setShowFilterMenu(true);

  const hasFiltersApplied = !!(filterQuery.onlyJoined ?? filterQuery.q);

  return (
    <div className="fixed -mt-16 sm:-mt-24 lg:-mt-32 z-10 flex h-16 w-full items-center justify-center bg-primary text-white sm:h-24  ">
      <div className="container flex w-full flex-row justify-between px-2 md:px-4 lg:max-w-[1024px]">
        <div className=" text-4xl tracking-wide sm:text-5xl">
          <button
            type="button"
            onClick={goHome}
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
          </button>
        </div>

        <div className="flex items-center gap-4">
          {isRidesPage && (
            <button
              type="button"
              onClick={showFilters}
              title="Filter results"
              aria-label="Filter results"
              className="flex items-center rounded p-1 text-3xl"
            >
              {hasFiltersApplied ? (
                <FilterSelectedIcon className="fill-white w-6 h-6" />
              ) : (
                <FilterIcon className="fill-white w-6 h-6" />
              )}
            </button>
          )}

          <UserMenu
            isAuthenticated={isAuthenticated}
            role={role}
            rideId={rideId}
          />
        </div>
      </div>
    </div>
  );
};
