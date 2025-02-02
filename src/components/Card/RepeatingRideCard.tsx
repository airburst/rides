"use client";
import { getNow } from "@utils/dates";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BasicCard } from ".";
import { type RepeatingRide } from "../../types";

type Props = {
  ride: RepeatingRide;
};

export const RepeatingRideCard: React.FC<Props> = ({ ride }: Props) => {
  const { id, name, rideGroup, distance, textRule, endDate } = ride;
  const router = useRouter();

  const isExpired = endDate ? endDate <= getNow() : false;
  const details = `${distance ?? ""} km | ${textRule}`;

  if (!id) {
    return null;
  }
  const link = `/repeating-rides/${id}`;
  const onPress = () => router.push(link);

  return (
    <Link href={link} prefetch={true}>
      <BasicCard onPress={onPress}>
        <div className="flex-1 flex-col gap-1 truncate p-2 lg:flex-row">
          <div className="align-middle font-bold uppercase tracking-wide">
            {name} {rideGroup ? `- ${rideGroup}` : ""}{" "}
          </div>
          <div className="truncate">{details}</div>
        </div>

        {isExpired && (
          <div className="flex h-full w-24 items-center justify-center rounded-r bg-secondary px-2 text-white">
            EXPIRED
          </div>
        )}
      </BasicCard>
    </Link>
  );
};
