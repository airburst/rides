import { MainContent } from "@/components/Layout/MainContent";
import { Skeleton } from "@/components/Skeleton";
import type { JSX } from "react";

type RowProps = {
  children: JSX.Element | JSX.Element[] | null | undefined;
};

const Heading = ({ children }: RowProps) => (
  <div className="bg-primary flex w-full flex-row items-center justify-center p-2 font-bold tracking-wide text-white uppercase sm:rounded">
    {children}
  </div>
);

const LoadingUsers = () => {
  return (
    <MainContent>
      <>
        <div className="grid w-full grid-cols-1 gap-2 px-2 sm:px-0 md:grid-cols-2 md:gap-4 lg:grid-cols-3" />
        <div className="flex w-full flex-col gap-2">
          <Heading>
            <div>Manage Users</div>
          </Heading>

          <div className="w-full px-2 sm:px-0">
            <input
              type="text"
              id="search"
              name="search"
              className="input input-lg my-2 w-full"
              placeholder="Search by name or email"
            />
          </div>

          <div className="grid w-full grid-cols-1 gap-2 px-2 sm:px-0 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
            <div className="box-border flex w-full flex-col gap-2 rounded-lg bg-white p-4 shadow-md">
              <Skeleton className="w-64" />
              <Skeleton className="w-48" />
              <Skeleton className="bg-accent h-6 w-24" />
            </div>
            <div className="box-border flex w-full flex-col gap-2 rounded-lg bg-white p-4 shadow-md">
              <Skeleton className="w-64" />
              <Skeleton className="w-48" />
            </div>
            <div className="box-border flex w-full flex-col gap-2 rounded-lg bg-white p-4 shadow-md">
              <Skeleton className="w-64" />
              <Skeleton className="w-48" />
              <Skeleton className="bg-accent h-6 w-24" />
            </div>
            <div className="box-border flex w-full flex-col gap-2 rounded-lg bg-white p-4 shadow-md">
              <Skeleton className="w-64" />
              <Skeleton className="w-48" />
            </div>
            <div className="box-border flex w-full flex-col gap-2 rounded-lg bg-white p-4 shadow-md">
              <Skeleton className="w-64" />
              <Skeleton className="w-48" />
              <Skeleton className="bg-accent h-6 w-24" />
            </div>
          </div>
        </div>
      </>
    </MainContent>
  );
};

export default LoadingUsers;
