/* eslint-disable @next/next/no-img-element */
import { makeClickableUrl } from "@utils/makeClickableUrl";
import { type RideNote } from "src/types";

export const ChatMessage: React.FC<RideNote> = ({
  name,
  rideNotes,
  image,
}: RideNote) => (
  <div className="flex chat chat-start pl-2">
    {image && (
      <div className="chat-image avatar placeholder">
        <div className="bg-neutral text-neutral-content rounded-full w-10">
          <img alt="Tailwind CSS chat bubble component" src={image} />
        </div>
      </div>
    )}
    <div className="flex w-full flex-col">
      <div className="chat-header">{name}</div>
      <div
        className="chat-bubble font-display"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: makeClickableUrl(rideNotes ?? "") }}
      />
    </div>
  </div>
);
