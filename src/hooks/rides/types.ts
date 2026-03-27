import type { Ride, RideList } from "@/types";

export type RidesResponse = { rides: RideList[] };
export type RideResponse = { ride: Ride };

export type CreateRideInput = {
  name: string;
  rideDate: string;
  distance: number;
  rideGroup?: string | null;
  destination?: string | null;
  meetPoint?: string | null;
  route?: string | null;
  leader?: string | null;
  notes?: string | null;
  rideLimit?: number;
  scheduleId?: string;
};

export type UpdateRideInput = Partial<CreateRideInput>;

export type { Ride, RideList };
