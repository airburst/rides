import Skeleton from "react-loading-skeleton";

type RowProps = {
  children: JSX.Element | JSX.Element[] | null | undefined;
};

const Row = ({ children }: RowProps) => (
  <div className="flex w-full flex-row items-center justify-between px-2 font-medium md:grid md:grid-cols-[220px_1fr] md:justify-start md:gap-4">
    {children}
  </div>
);

const Heading = ({ children }: RowProps) => (
  <div className="flex w-full flex-row items-center justify-center bg-primary p-2 font-bold uppercase tracking-wide text-white sm:rounded">
    {children}
  </div>
);

export const RideDetailsSkeleton = () => (
  <div className="flex w-full flex-col gap-2">
    <Heading>
      <div>FUNDAY 00 NOWONDER</div>
    </Heading>

    <div className="flex w-full flex-col gap-2 px-2 sm:px-0">
      <div className="flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
        <Row>
          <div className="text-xl font-bold tracking-wide text-neutral-700">
            <Skeleton />
          </div>
          <div className="text-xl font-bold tracking-wide text-neutral-700">
            <Skeleton />
          </div>
          <div className="text-xl font-bold tracking-wide text-neutral-700">
            <Skeleton />
          </div>
          <div className="text-xl font-bold tracking-wide text-neutral-700">
            <Skeleton />
          </div>
          <div className="text-xl font-bold tracking-wide text-neutral-700">
            <Skeleton />
          </div>
          <div className="text-xl font-bold tracking-wide text-neutral-700">
            <Skeleton />
          </div>
          <div className="text-xl font-bold tracking-wide text-neutral-700">
            <Skeleton />
          </div>
          <div className="text-xl font-bold tracking-wide text-neutral-700">
            <Skeleton />
          </div>
        </Row>
      </div>
    </div>

    <Heading>
      <div className="flex items-center gap-4">
        Going
        <Skeleton />
      </div>
    </Heading>
  </div>
);
