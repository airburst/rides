"use client";
import { deleteRepeatingRide } from "@/server/actions/delete-repeating-ride";
import { type RepeatingRide } from "@/types";
import { formatDate, formatTime } from "@utils/dates";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { BackButton, Button } from "../Button";
import { ConfirmWithContent } from "../ConfirmWithContent";

type Props = {
  ride: RepeatingRide;
};

type RowProps = {
  children: JSX.Element | JSX.Element[] | null | undefined;
};

const Row = ({ children }: RowProps) => (
  <div className="grid w-full grid-cols-[100px_1fr] items-center justify-between px-2 font-medium md:grid-cols-[220px_1fr] md:justify-start md:gap-4 gap-2">
    {children}
  </div>
);

export const RepeatingRideDetails = ({ ride }: Props) => {
  const [showConfirmDelete, setShowDelete] = useState<boolean>(false);
  const [deleteAllRides, setDeleteAllRides] = useState<boolean>(true);
  const router = useRouter();

  const {
    id,
    name,
    rideGroup,
    meetPoint,
    destination,
    distance,
    leader,
    route,
    notes,
    rideLimit,
    startDate,
    winterStartTime,
    endDate,
    textRule,
  } = ride;
  const time = formatTime(startDate);

  const goToCopy = () => router.push(`./copy/${id}`);

  const goToEdit = () => router.push(`./edit/${id}`);

  const toggleDeleteAllRides = () => setDeleteAllRides(!deleteAllRides);

  const handleDelete = async (cb: (flag: boolean) => void) => {
    const results = await deleteRepeatingRide(id!, deleteAllRides);

    if (results.success) {
      const message = results.deletedRideCount && results.deletedRideCount > 0
        ? `Repeating ride and ${results.deletedRideCount} future rides have been deleted.`
        : "Repeating ride has been deleted.";
      toast.success(message)
      hideConfirm();
      router.back();
      cb(true);
    } else {
      toast.error("Unable to delete repeating ride. Please try again.")
      cb(false);
    }
  };

  const showConfirm = () => setShowDelete(true);
  const hideConfirm = () => setShowDelete(false);

  return (
    <>
      <div className="flex w-full flex-row items-center justify-center bg-primary p-2 font-bold uppercase tracking-wide text-white sm:rounded mb-2">
        Repeating Ride Details
      </div>

      <div className="flex w-full flex-col gap-2 px-2 sm:px-0 mb-4">
        <div className="relative flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
          <Row>
            <div>Name</div>
            <div className="text-xl font-bold tracking-wide text-neutral-700 truncate">
              {name}
            </div>
          </Row>
          {rideGroup && (
            <Row>
              <div>Group</div>
              <div className="min-w-0">{rideGroup}</div>
            </Row>
          )}
          {meetPoint && (
            <Row>
              <div>Meet at</div>
              <div className="min-w-0">{meetPoint}</div>
            </Row>
          )}
          {destination && (
            <Row>
              <div>Destination</div>
              <div className="min-w-0">{destination}</div>
            </Row>
          )}
          {distance && (
            <Row>
              <div>Distance</div>
              <div>{distance}</div>
            </Row>
          )}
          {leader && (
            <Row>
              <div>Leader</div>
              <div>{leader}</div>
            </Row>
          )}
          {rideLimit && rideLimit > -1 && (
            <Row>
              <div>Limit</div>
              <div>{rideLimit}</div>
            </Row>
          )}
          {route && (
            <Row>
              <a
                className="col-span-2 text-primary underline hover:text-primary-focus"
                href={route}
                target="_blank"
                rel="noreferrer"
              >
                Click to see route
              </a>
            </Row>
          )}
        </div>

        {notes && (
          <div className="flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
            <div className="px-2 text-xl font-bold tracking-wide text-neutral-700">
              Notes
            </div>
            <Row>
              <div
                className="col-span-2 whitespace-pre-line"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: (notes) }}
              />
            </Row>
          </div>
        )}

        <div className="flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
          <div className="px-2 text-xl font-bold tracking-wide text-neutral-700">
            Schedule
          </div>
          {textRule && (
            <Row>
              <div className="col-span-2 whitespace-pre-line">
                &quot;{textRule}&quot;
              </div>
            </Row>
          )}
          <Row>
            <div>Start time</div>
            <div>{time}</div>
          </Row>
          <Row>
            <div>Winter</div>
            <div>{winterStartTime}</div>
          </Row>
          <Row>
            <div>Next run</div>
            <div>{formatDate(startDate)}</div>
          </Row>
          {endDate && (
            <Row>
              <div>End date</div>
              <div>{formatDate(endDate)}</div>
            </Row>
          )}
        </div>
      </div>

      <div className="flex justify-between sm:justify-start w-full gap-4 px-2 sm:p-0">
        <BackButton />
        <Button secondary onClick={goToEdit}>
          Edit
        </Button>
        <Button accent onClick={goToCopy}>
          Copy
        </Button>
        <Button error onClick={showConfirm}>
          Delete
        </Button>
      </div>

      <ConfirmWithContent
        open={showConfirmDelete}
        closeHandler={hideConfirm}
        heading="Are you sure you want to delete this repeating ride?"
        onYes={(callback) => handleDelete(callback)}
      >
        <div>
          <div className="form-control">
            <label htmlFor="cascade" className="label cursor-pointer">
              <span className="label-text">
                Also delete or cancel every future ride created from this
                schedule
              </span>
              <input
                id="cascade"
                type="radio"
                name="radio-cascade"
                checked={deleteAllRides}
                onChange={toggleDeleteAllRides}
              />
            </label>
          </div>
          <div className="form-control">
            <label htmlFor="no-cascade" className="label cursor-pointer">
              <span className="label-text">
                Only delete the schedule and keep all of the rides
              </span>
              <input
                id="no-cascade"
                type="radio"
                name="radio-cascade"
                checked={!deleteAllRides}
                onChange={toggleDeleteAllRides}
              />
            </label>
          </div>
        </div>
      </ConfirmWithContent>
    </>
  );
}