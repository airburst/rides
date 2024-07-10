import { MainContent } from "@/components/Layout/MainContent";
import { Skeleton } from "@/components/Skeleton";

type RowProps = {
  children: JSX.Element | JSX.Element[] | null | undefined;
};

const Row = ({ children }: RowProps) => (
  <div className="grid w-full grid-cols-[100px_1fr] items-center px-2 font-medium md:grid-cols-[220px_1fr] md:justify-start md:gap-4 gap-2">
    {children}
  </div>
);

const Heading = ({ children }: RowProps) => (
  <div className="flex w-full flex-row items-center justify-center bg-primary p-2 font-bold uppercase tracking-wide text-white sm:rounded">
    {children}
  </div>
);

const LoadingUsers = () => {
  return <MainContent>
    <>
      <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 px-2 sm:px-0">

      </div>
      <div className="flex w-full flex-col gap-2">
        <Heading>
          <div>Manage Users</div>
        </Heading>

        <div className="w-full px-2 sm:px-0">
          <input
            type="text"
            id="search"
            name="search"
            className="input input-bordered input-lg w-full my-2"
            placeholder="Search by name or email"
          />
        </div>

        <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 px-2 sm:px-0">
          <div className="flex w-full flex-col gap-2 box-border rounded-lg bg-white p-4 shadow-md">
            <Skeleton className="w-64" />
            <Skeleton className="w-48" />
            <Skeleton className="w-24 h-6 bg-accent" />
          </div>
          <div className="flex w-full flex-col gap-2 box-border rounded-lg bg-white p-4 shadow-md">
            <Skeleton className="w-64" />
            <Skeleton className="w-48" />
          </div>
          <div className="flex w-full flex-col gap-2 box-border rounded-lg bg-white p-4 shadow-md">
            <Skeleton className="w-64" />
            <Skeleton className="w-48" />
            <Skeleton className="w-24 h-6 bg-accent" />
          </div>
          <div className="flex w-full flex-col gap-2 box-border rounded-lg bg-white p-4 shadow-md">
            <Skeleton className="w-64" />
            <Skeleton className="w-48" />
          </div>
          <div className="flex w-full flex-col gap-2 box-border rounded-lg bg-white p-4 shadow-md">
            <Skeleton className="w-64" />
            <Skeleton className="w-48" />
            <Skeleton className="w-24 h-6 bg-accent" />
          </div>
        </div>
      </div>
    </>
  </MainContent>;
};

export default LoadingUsers;