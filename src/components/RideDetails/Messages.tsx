import { ChatMessage } from "@components/ChatMessage";
import { type RideNote } from "src/types";

const EMPTY_NOTES: RideNote[] = [];

type Props = {
  riderNotes?: RideNote[];
};

export const Messages = ({ riderNotes = EMPTY_NOTES }: Props) => {
  if (riderNotes.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex w-full gap-2 flex-col rounded bg-white p-2 lg:p-4 shadow-md ">
        <div className="text-xl font-bold tracking-wide text-neutral-700">
          Messages
        </div>
        {riderNotes?.map((notes, i) => (
          <ChatMessage key={notes.name || i} {...notes} />
        ))}
      </div>
    </div>
  );
};
