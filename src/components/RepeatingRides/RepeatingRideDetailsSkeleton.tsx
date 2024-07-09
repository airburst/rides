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

export const RepeatingRideDetailsSkeleton = () => (
  <div className="flex w-full flex-col gap-2">
    <Heading>
      <div>Repeating Ride Details</div>
    </Heading>

    <div className="flex w-full flex-col gap-2 px-2 sm:px-0">
      <div className="flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
        <Row>
          <div>Name</div>
          <Skeleton />
        </Row>
        <Row>
          <div>Group</div>
          <Skeleton width={32} />
        </Row>
        <Row>
          <div>Meet at</div>
          <Skeleton />
        </Row>
        <Row>
          <div>Distance</div>
          <Skeleton width={24} />
        </Row>
        <Row>
          <div>Leader</div>
          <Skeleton width={24} />
        </Row>
      </div>
    </div>

    <div className="flex w-full flex-col gap-2 px-2 sm:px-0">
      <div className="flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md h-48">
        <div className="px-2 text-xl font-bold tracking-wide text-neutral-700">
          Notes
        </div>
        <Row>
          <Skeleton width={80} />
        </Row>
        <Row>
          <Skeleton />
        </Row>
      </div>
    </div>

    <div className="flex w-full flex-col gap-2 px-2 sm:px-0">
      <div className="flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md h-48">
        <div className="px-2 text-xl font-bold tracking-wide text-neutral-700">
          Schedule
        </div>
        <Row>
          <Skeleton width={80} />
        </Row>
        <Row>
          <Skeleton />
        </Row>
      </div>
    </div>
  </div>
);
