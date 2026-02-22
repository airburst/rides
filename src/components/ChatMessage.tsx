import DOMPurify from "isomorphic-dompurify";
import { resolveAvatarUrl } from "@/lib/avatar";
import { makeClickableUrl } from "@utils/makeClickableUrl";
import { type RideNote } from "src/types";

export const ChatMessage: React.FC<RideNote> = ({
  name,
  rideNotes,
  image,
}: RideNote) => (
  <div className="flex gap-2 pl-2">
    {image && (
      <div className="shrink-0">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-neutral">
          <img
            alt={`${name}'s avatar`}
            src={resolveAvatarUrl(image)}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    )}
    <div className="flex w-full flex-col">
      <div className="text-xs font-medium opacity-60">{name}</div>
      <div
        className="wrap-break-word rounded-lg rounded-tl-none bg-neutral-100 px-3 py-2 leading-snug text-neutral-700"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(makeClickableUrl(rideNotes ?? "")),
        }}
      />
    </div>
  </div>
);
