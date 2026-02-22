import { ConfirmWithContent } from "@/components/ConfirmWithContent";
import { memo } from "react";

type DeleteConfirmationProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (callback: (flag: boolean) => void) => void;
  deleteAllRides: boolean;
  toggleDeleteAllRides: () => void;
};

export const DeleteConfirmation = memo(
  ({
    open,
    onClose,
    onConfirm,
    deleteAllRides,
    toggleDeleteAllRides,
  }: DeleteConfirmationProps) => {
    return (
      <ConfirmWithContent
        open={open}
        closeHandler={onClose}
        heading="Are you sure you want to delete this repeating ride?"
        onYes={onConfirm}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="cascade" className="flex cursor-pointer items-center gap-2">
            <span className="flex-1 text-sm">
              Delete schedule and ALL future rides
            </span>
            <input
              id="cascade"
              type="radio"
              name="radio-cascade"
              className="shrink-0"
              checked={deleteAllRides}
              onChange={toggleDeleteAllRides}
            />
          </label>

          <label htmlFor="no-cascade" className="flex cursor-pointer items-center gap-2">
            <span className="flex-1 text-sm">
              Delete the schedule, but keep future rides
            </span>
            <input
              id="no-cascade"
              type="radio"
              name="radio-cascade"
              className="shrink-0"
              checked={!deleteAllRides}
              onChange={toggleDeleteAllRides}
            />
          </label>
        </div>
      </ConfirmWithContent>
    );
  },
);

DeleteConfirmation.displayName = "DeleteConfirmation";
