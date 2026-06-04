import { resolveAvatarUrl } from "@/lib/avatar";
import { User } from "lucide-react";
import { memo } from "react";

type AvatarSectionProps = {
  imageUrl?: string | null;
  onChangeClick: () => void;
};

export const AvatarSection = memo(
  ({ imageUrl, onChangeClick }: AvatarSectionProps) => {
    const avatarUrl = resolveAvatarUrl(imageUrl);

    return (
      <button
        type="button"
        onClick={onChangeClick}
        aria-label="Change avatar"
        className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-neutral">
          {avatarUrl ? (
            <img
              className="h-full w-full object-cover text-neutral-500"
              src={avatarUrl}
              width={128}
              height={128}
              alt="Profile avatar"
            />
          ) : (
            <User
              className="p-1 text-neutral-500"
              style={{ width: "5rem", height: "5rem" }}
            />
          )}
        </div>
        <span className="text-sm text-neutral-500">Click image to change</span>
      </button>
    );
  },
);

AvatarSection.displayName = "AvatarSection";
