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
      <div className="flex w-full flex-col rounded bg-white py-2 shadow-md ">
        <div className="px-2 pb-2 text-xl font-bold tracking-wide text-neutral-700">
          Messages
        </div>
        {riderNotes?.map((notes, i) => (
          <ChatMessage key={notes.name || i} {...notes} />
        ))}
      </div>
    </div>
  );
};
