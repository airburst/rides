"use client";
import { getNow } from "@utils/dates";
import { useRouter } from "next/navigation";
import { BasicCard } from ".";
import { type RepeatingRide } from "../../types";

type Props = {
  ride: RepeatingRide;
};

export const RepeatingRideCard: React.FC<Props> = ({ ride }: Props) => {
  const router = useRouter();
  const { id, name, group, distance, textRule, endDate } = ride;

  const isExpired = endDate ? endDate <= getNow() : false;
  const details = `${distance ?? ""} km | ${textRule}`;

  const onPress = () => router.push(`/repeating-rides/${id}`);

  if (!id) {
    return null;
  }

  return (
    <BasicCard onPress={onPress}>
      <div className="flex-col lg:flex-row flex-1 p-2 gap-1 truncate">
        <div className="align-middle font-bold uppercase tracking-wide">
          {name} {group ? `- ${group}` : ""}{" "}
        </div>
        <div className="truncate">{details}</div>
      </div>

      {isExpired && (
        <div className="px-2 text-white h-full flex items-center justify-center rounded-r w-24 bg-secondary">
          EXPIRED
        </div>
      )}
    </BasicCard>
  );
};
