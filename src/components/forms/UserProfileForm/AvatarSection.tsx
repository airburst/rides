import { resolveAvatarUrl } from "@/lib/avatar";
import { memo } from "react";

type AvatarSectionProps = {
  imageUrl: string;
  onChangeClick: () => void;
};

export const AvatarSection = memo(
  ({ imageUrl, onChangeClick }: AvatarSectionProps) => {
    return (
      <button
        type="button"
        onClick={onChangeClick}
        aria-label="Change avatar"
        className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="avatar">
          <div className="w-32 rounded-full">
            <img
              className="text-neutral-500"
              src={resolveAvatarUrl(imageUrl)}
              width={128}
              height={128}
              alt="Profile avatar"
            />
          </div>
        </div>
        <span className="text-sm text-neutral-500">Click image to change</span>
      </button>
    );
  },
);

AvatarSection.displayName = "AvatarSection";
