import { type RideFormProps } from "@/components/forms/RideForm";
import { MainContent } from "@/components/Layout/MainContent";
import { getRepeatingRide } from "@/server/actions/get-repeating-ride";
import { canUseAction } from "@/server/auth";
import { formatFormDate, getNow } from "@utils/dates";
import { flattenArrayNumber } from "@utils/forms";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const RideForm = dynamic<RideFormProps>(() => import("@/components/forms/RideForm"));

export default async function CopyRepeatingRide({ params }: { params: { id: string } }) {
  const { id } = params;
  const isAdmin = await canUseAction("LEADER");

  // Redirect if not admin
  if (!isAdmin) {
    redirect("/");
  }

  const { ride: repeatingRide, error } = await getRepeatingRide(id);

  if (error ?? !repeatingRide) {
    return (
      <MainContent>
        <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
          <div className="flex h-full items-center p-8 pt-32 text-2xl">
            Error loading ride
          </div>
        </div>
      </MainContent>
    );
  }

  const rideDate = formatFormDate(getNow()).split("T")[0]!;
  const startDate = repeatingRide.startDate.split("T")[0];
  const time = repeatingRide.startDate.split("T")[1]?.substring(0, 5) ?? "08:30";

  const defaultValues = {
    name: repeatingRide.name,
    freq: repeatingRide.freq,
    rideDate,
    startDate,
    endDate: repeatingRide.endDate
      ? formatFormDate(repeatingRide.endDate)
      : undefined,
    time,
    winterStartTime: "08:30",
    rideGroup: repeatingRide.rideGroup ?? "",
    destination: repeatingRide.destination ?? "",
    meetPoint: repeatingRide.meetPoint ?? "",
    notes: repeatingRide.notes ?? "",
    leader: repeatingRide.leader ?? "",
    route: repeatingRide.route ?? "",
    distance: repeatingRide.distance ?? 1,
    rideLimit: repeatingRide.rideLimit ?? -1,
    // Flatten arrays to scalars
    byweekday: flattenArrayNumber(repeatingRide.byweekday),
    bysetpos: flattenArrayNumber(repeatingRide.bysetpos),
    bymonthday: flattenArrayNumber(repeatingRide.bymonthday),
  };

  return (
    <MainContent>
      <RideForm
        defaultValues={defaultValues}
        isRepeating
        isAdmin={!!isAdmin} />
    </MainContent>
  )
}
