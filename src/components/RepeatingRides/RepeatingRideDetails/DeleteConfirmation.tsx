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
        <div>
          <div className="">
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
          <div className="">
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
    );
  },
);

DeleteConfirmation.displayName = "DeleteConfirmation";
