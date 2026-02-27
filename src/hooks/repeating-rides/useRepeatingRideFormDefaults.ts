import { type RideFormSchema } from "@/components/forms/formSchemas";
import { useSession } from "@/hooks/useSession";
import { formatFormDate, getFormRideDateAndTime, getNow } from "@utils/dates";
import { flattenArrayNumber } from "@utils/forms";
import { useRepeatingRide } from "./useRepeatingRide";

type UseRepeatingRideFormDefaultsResult = {
  defaultValues: RideFormSchema | null;
  isLoading: boolean;
  error: unknown;
  isLeaderOrAdmin: boolean;
  isAdmin: boolean;
};

export const useRepeatingRideFormDefaults = (
  id: string,
  mode: "edit" | "copy" = "edit",
): UseRepeatingRideFormDefaultsResult => {
  const { session, isLoading: authLoading } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const isLeaderOrAdmin = isAdmin || session?.user?.role === "LEADER";

  const { data: repeatingRide, isLoading, error } = useRepeatingRide(id);

  if (!repeatingRide) {
    return {
      defaultValues: null,
      isLoading: authLoading || isLoading,
      error,
      isLeaderOrAdmin,
      isAdmin,
    };
  }

  const { rideDate, startDate, time } = getFormRideDateAndTime(
    repeatingRide.startDate,
  );
  const today = formatFormDate(getNow());
  const defaultTime = mode === "copy" ? time : repeatingRide.winterStartTime;

  return {
    defaultValues: {
      id: mode === "edit" ? id : undefined,
      name: repeatingRide.name,
      freq: repeatingRide.freq,
      rideDate: mode === "copy" ? today : rideDate,
      startDate,
      endDate: repeatingRide.endDate
        ? formatFormDate(repeatingRide.endDate)
        : undefined,
      time,
      winterStartTime: defaultTime ?? "08:30",
      rideGroup: repeatingRide.rideGroup ?? "",
      destination: repeatingRide.destination ?? "",
      meetPoint: repeatingRide.meetPoint ?? "",
      notes: repeatingRide.notes ?? "",
      leader: repeatingRide.leader ?? "",
      route: repeatingRide.route ?? "",
      distance: repeatingRide.distance ?? 1,
      rideLimit: repeatingRide.rideLimit ?? -1,
      byweekday: flattenArrayNumber(repeatingRide.byweekday),
      bysetpos: flattenArrayNumber(repeatingRide.bysetpos),
      bymonthday: flattenArrayNumber(repeatingRide.bymonthday),
    },
    isLoading: authLoading || isLoading,
    error,
    isLeaderOrAdmin,
    isAdmin,
  };
};
