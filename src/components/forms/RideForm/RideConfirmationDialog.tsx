import { ConfirmWithContent } from "@/components/ConfirmWithContent";
import { memo } from "react";

type RideConfirmationDialogProps = {
  open: boolean;
  rideDateList: string[];
  onYes: (callback: (flag: boolean) => void) => void;
  onNo: () => void;
};

export const RideConfirmationDialog = memo(
  ({ open, rideDateList, onYes, onNo }: RideConfirmationDialogProps) => {
    return (
      <ConfirmWithContent
        open={open}
        closeHandler={onNo}
        heading="Do you want to create rides on the following dates using this schedule?"
        onYes={onYes}
      >
        <>
          {rideDateList.map((date) => (
            <div key={date}>{date}</div>
          ))}
        </>
      </ConfirmWithContent>
    );
  },
);

RideConfirmationDialog.displayName = "RideConfirmationDialog";
