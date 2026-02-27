import { type RideFormSchema } from "@/components/forms/formSchemas";
import { useSession } from "@/hooks/useSession";
import { getFormRideDateAndTime } from "@utils/dates";
import { useRide } from "./useRide";

type UseRideFormDefaultsResult = {
  defaultValues: RideFormSchema | null;
  isLoading: boolean;
  error: unknown;
  isLeaderOrAdmin: boolean;
  isAdmin: boolean;
};

export const useRideFormDefaults = (
  id: string,
  mode: "edit" | "copy" = "edit",
): UseRideFormDefaultsResult => {
  const { session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";
  const isLeaderOrAdmin = isAdmin || user?.role === "LEADER";

  const { data: ride, isLoading, error } = useRide(id);

  if (!ride) {
    return {
      defaultValues: null,
      isLoading,
      error,
      isLeaderOrAdmin,
      isAdmin,
    };
  }

  const { rideDate, time } = getFormRideDateAndTime(ride.rideDate);

  return {
    defaultValues: {
      id: mode === "edit" ? id : undefined,
      name: ride.name ?? "",
      rideDate,
      time,
      rideGroup: ride.rideGroup ?? "",
      destination: ride.destination ?? "",
      meetPoint: ride.meetPoint ?? "",
      distance: +(ride.distance ?? 0),
      leader: ride.leader ?? "",
      route: ride.route ?? "",
      notes: ride.notes ?? "",
      rideLimit: +(ride.rideLimit ?? -1),
      interval: 1,
      freq: 2,
    },
    isLoading,
    error,
    isLeaderOrAdmin,
    isAdmin,
  };
};
