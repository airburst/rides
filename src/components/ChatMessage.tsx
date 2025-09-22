/* eslint-disable @next/next/no-img-element */
import { makeClickableUrl } from "@utils/makeClickableUrl";
import type { RideNote } from "src/types";

export const ChatMessage: React.FC<RideNote> = ({
  name,
  rideNotes,
  image,
}: RideNote) => (
  <div className="chat chat-start flex pl-2">
    {image && (
      <div className="avatar placeholder chat-image">
        <div className="bg-neutral text-neutral-content w-10 rounded-full">
          <img alt="Tailwind CSS chat bubble component" src={image} />
        </div>
      </div>
    )}
    <div className="flex w-full flex-col">
      <div className="chat-header">{name}</div>
      <div
        className="chat-bubble leading-snug break-words text-neutral-700"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: makeClickableUrl(rideNotes ?? "") }}
      />
    </div>
  </div>
);
