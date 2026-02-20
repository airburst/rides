import DOMPurify from "isomorphic-dompurify";
import { resolveAvatarUrl } from "@/lib/avatar";
import { makeClickableUrl } from "@utils/makeClickableUrl";
import { type RideNote } from "src/types";

export const ChatMessage: React.FC<RideNote> = ({
  name,
  rideNotes,
  image,
}: RideNote) => (
  <div className="chat chat-start flex pl-2">
    {image && (
      <div className="avatar placeholder chat-image">
        <div className="w-10 rounded-full bg-neutral text-neutral-content">
          <img
            alt="Tailwind CSS chat bubble component"
            src={resolveAvatarUrl(image)}
          />
        </div>
      </div>
    )}
    <div className="flex w-full flex-col">
      <div className="chat-header">{name}</div>
      <div
        className="chat-bubble wrap-break-word leading-snug text-neutral-700"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(makeClickableUrl(rideNotes ?? "")),
        }}
      />
    </div>
  </div>
);
