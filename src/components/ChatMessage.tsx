import { resolveAvatarUrl } from "@/lib/avatar";
import { makeClickableUrl } from "@utils/makeClickableUrl";
import DOMPurify from "isomorphic-dompurify";
import { User } from "lucide-react";
import { type RideNote } from "src/types";

export const ChatMessage: React.FC<RideNote> = ({
  name,
  rideNotes,
  image,
}: RideNote) => {
  const avatarUrl = resolveAvatarUrl(image);

  return (
    <div className="flex items-end gap-2">
      <div className="shrink-0">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-neutral">
          {avatarUrl ? (
            <img
              alt={`${name}'s avatar`}
              src={avatarUrl}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-5 w-5 text-neutral-500" />
          )}
        </div>
      </div>
      <div className="flex w-full flex-col">
        <div className="text-xs font-medium opacity-75 pb-1">{name}</div>
        <div
          className="relative w-fit max-w-full wrap-break-word rounded-lg rounded-bl-none bg-neutral-200 px-3 py-2 leading-snug text-neutral-700 before:absolute before:-left-2 before:bottom-0 before:h-0 before:w-0 before:border-8 before:border-transparent before:border-r-neutral-200 before:border-b-neutral-200 before:content-['']"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(makeClickableUrl(rideNotes ?? "")),
          }}
        />
      </div>
    </div>
  );
};
