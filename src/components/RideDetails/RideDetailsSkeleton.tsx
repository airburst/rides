import { Skeleton } from "../Skeleton";

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

export const RideDetailsSkeleton = () => (
  <div className="flex w-full flex-col gap-2">
    <Heading>
      <div>Ride Details</div>
    </Heading>

    <div className="flex w-full flex-col gap-2 px-2 sm:px-0">
      <div className="flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
        <Row>
          <div>Name</div>
          <Skeleton className="w-full" />
        </Row>
        <Row>
          <div>Group</div>
          <Skeleton width={32} />
        </Row>
        <Row>
          <div>Meet at</div>
          <Skeleton width={32} />
        </Row>
        <Row>
          <div>Distance</div>
          <Skeleton width={8} />
        </Row>
        <Row>
          <div>Leader</div>
          <Skeleton width={24} />
        </Row>
      </div>
    </div>

    <div className="flex w-full flex-col gap-2 px-2 sm:px-0">
      <div className="flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
        <div className="px-2 text-xl font-bold tracking-wide text-neutral-700">
          Notes
        </div>
        <Row>
          <div className="col-span-2 flex flex-col gap-2">
            <Skeleton className="w-full" />
            <Skeleton className="w-[240px]" />
            <Skeleton className="w-[200px]" />
            <Skeleton className="w-[240px]" />
          </div>
        </Row>
      </div>
    </div>

    <Heading>
      <div>GOING</div>
    </Heading>

    <div className="flex w-full flex-col gap-2 px-2 sm:px-0">
      <div className="flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
        <Row>
          <Skeleton width={80} />
          <Skeleton className="w-full" />
        </Row>
        <Row>
          <Skeleton width={80} />
          <Skeleton className="w-full" />
        </Row>
        <Row>
          <Skeleton width={80} />
          <Skeleton className="w-full" />
        </Row>
      </div>
    </div>
  </div>
);
