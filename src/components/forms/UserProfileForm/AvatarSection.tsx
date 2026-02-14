import { resolveAvatarUrl } from "@/lib/avatar";
import { Button } from "@/components/Button";
import { EditIcon } from "lucide-react";
import { memo } from "react";

type AvatarSectionProps = {
  imageUrl: string;
  onChangeClick: () => void;
};

export const AvatarSection = memo(
  ({ imageUrl, onChangeClick }: AvatarSectionProps) => {
    return (
      <div className="grid w-full grid-cols-[auto_auto_auto] items-center justify-start gap-4 md:gap-8">
        <div className="flex flex-col gap-1">Avatar</div>
        <div className="avatar">
          <div className="w-20 rounded-full">
            <img
              className="text-neutral-500"
              src={resolveAvatarUrl(imageUrl)}
              width={80}
              height={80}
              alt="Avatar"
            />
          </div>
        </div>
        <Button accent onClick={onChangeClick}>
          <EditIcon />
          CHANGE
        </Button>
      </div>
    );
  },
);

AvatarSection.displayName = "AvatarSection";
