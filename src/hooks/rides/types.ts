import type { Ride, RideList } from "@/types";

export type RidesResponse = { rides: RideList[] };
export type RideResponse = { ride: Ride };

export type CreateRideInput = {
  name: string;
  rideDate: string;
  distance: number;
  rideGroup?: string;
  destination?: string;
  meetPoint?: string;
  route?: string;
  leader?: string;
  notes?: string;
  rideLimit?: number;
  scheduleId?: string;
};

export type UpdateRideInput = Partial<CreateRideInput>;

export type { Ride, RideList };
