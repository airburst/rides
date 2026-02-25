import { useDeleteRepeatingRide } from "@/hooks/repeating-rides";
import { type RepeatingRide } from "@/types";
import { useRouter } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { BackButton, Button } from "../../Button";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { RideInfoSection } from "./RideInfoSection";
import { ScheduleSection } from "./ScheduleSection";

export type RepeatingRideDetailsProps = {
  ride: RepeatingRide;
};

const RepeatingRideDetails = ({ ride }: RepeatingRideDetailsProps) => {
  const [showConfirmDelete, setShowDelete] = useState<boolean>(false);
  const [deleteAllRides, setDeleteAllRides] = useState<boolean>(true);
  const router = useRouter();
  const deleteMutation = useDeleteRepeatingRide();

  const { id } = ride;

  const goToCopy = useCallback(
    () =>
      void router.navigate({
        to: "/repeating-rides/copy/$id",
        params: { id: id! },
      }),
    [router, id],
  );

  const goToEdit = useCallback(
    () =>
      void router.navigate({
        to: "/repeating-rides/edit/$id",
        params: { id: id! },
      }),
    [router, id],
  );

  const toggleDeleteAllRides = useCallback(
    () => setDeleteAllRides(!deleteAllRides),
    [deleteAllRides],
  );

  const handleDelete = useCallback(
    (cb: (flag: boolean) => void) => {
      deleteMutation.mutate(
        { id: id!, cascade: deleteAllRides },
        {
          onSuccess: (results) => {
            const message =
              results.deletedRideCount && results.deletedRideCount > 0
                ? `Repeating ride and ${results.deletedRideCount} future rides have been deleted.`
                : "Repeating ride has been deleted.";
            toast.success(message);
            setShowDelete(false);
            router.history.back();
            cb(true);
          },
          onError: () => {
            toast.error("Unable to delete repeating ride. Please try again.");
            cb(false);
          },
        },
      );
    },
    [deleteMutation, id, deleteAllRides, router],
  );

  const showConfirm = useCallback(() => setShowDelete(true), []);
  const hideConfirm = useCallback(() => setShowDelete(false), []);

  return (
    <>
      <div className="bg-primary mb-2 flex w-full flex-row items-center justify-center p-2 font-bold tracking-wide text-white uppercase sm:rounded">
        Repeating Ride Details
      </div>

      <div className="mb-4 flex w-full flex-col gap-2 px-2 sm:px-0">
        <RideInfoSection ride={ride} />
        <ScheduleSection ride={ride} />
      </div>

      <div className="grid w-full grid-cols-4 gap-2 justify-self-start px-2 sm:p-0 md:gap-4">
        <BackButton label="CANCEL" noIcon />
        <Button secondary onClick={goToCopy}>
          COPY
        </Button>
        <Button onClick={goToEdit}>EDIT</Button>
        <Button error onClick={showConfirm}>
          DELETE
        </Button>
      </div>

      <DeleteConfirmation
        open={showConfirmDelete}
        onClose={hideConfirm}
        onConfirm={handleDelete}
        deleteAllRides={deleteAllRides}
        toggleDeleteAllRides={toggleDeleteAllRides}
      />
    </>
  );
};

export default RepeatingRideDetails;
