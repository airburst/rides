import { DEFAULT_PREFERENCES } from "../../src/constants";
import {
  type Preferences,
  type Ride,
  type RideList,
  type User,
} from "../../src/types";
import { getRideDateAndTime } from "./dates";
import { getPreferences } from "./preferences";

export const formatUserName = (name: string | null | undefined): string => {
  if (!name) {
    return "";
  }

  return name
    .replace(".", " ")
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
    );
};

export const serialiseUser = (user?: User): User | null => {
  if (!user) {
    return null;
  }

  const { id, name, email, image, mobile, emergency, role } = user;
  const preferences = getPreferences(user);

  return {
    id,
    name: formatUserName(name),
    email: email || "Not supplied",
    image,
    mobile,
    emergency,
    role,
    preferences,
  };
};

export const formatUser = (
  user: User,
  notes?: string | null,
  isAuth = false,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, name, email, image, mobile, emergency, role } = user;
  const preferences = getPreferences(user);

  if (!isAuth) {
    return { id, name: "", rideNotes: notes };
  }

  return {
    id,
    name: formatUserName(name),
    email,
    image,
    mobile,
    emergency,
    role,
    rideNotes: notes,
    preferences,
  };
};

export const convertToMiles = (kms: number): number => Math.floor(kms / 1.6142);
export const convertToKms = (miles: number): number =>
  Math.ceil(miles * 1.6142);

export const convertDistance = (
  distance: number | null | string,
  units: string | undefined,
): string => {
  if (!distance) {
    return "Not set";
  }
  if (typeof distance === "string") {
    distance = parseFloat(distance);
  }
  if (units !== DEFAULT_PREFERENCES.units) {
    return `${convertToMiles(distance || 0)} ${units}`;
  }
  return `${distance} ${units}`;
};

export const formatRideData = (
  ride: Ride | RideList,
  preferences?: Preferences,
  // isAuth = false,
): Ride | RideList => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { rideDate, users, distance, ...rest } = ride;
  const { day, time } = getRideDateAndTime(new Date(rideDate).toISOString());
  const units = (preferences ?? DEFAULT_PREFERENCES)?.units;

  return {
    ...rest,
    rideDate: new Date(rideDate).toISOString(),
    day,
    time,
    distance: convertDistance(distance ?? 0, units),
    users,
  } as Ride | RideList;
};

export const formatInitials = (words: string): string => {
  const parts = words.split(" ");
  return parts
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

export const formatRideBadge = (ride: RideList): string => {
  if (ride.name === "Paceline" || ride.name === "Sunday Ride") {
    return ride.rideGroup
      ? ride.rideGroup.substring(0, 3) + ride.rideGroup.replace(/\D/g, "")
      : ride.name.substring(0, 3);
  }

  const name = formatInitials(ride.name);
  const group = ride.rideGroup ? ` ${formatInitials(ride.rideGroup)}` : "";
  return `${name}${group}`;
};

// Rides are generated with TBA as route and leader
// Return true if these have not been changed
export const isReady = (ride: Ride | RideList): boolean => {
  const { leader, route } = ride;
  if (!leader && !route) {
    return false;
  }
  return leader !== "TBA" && route !== "TBA";
};

// Flatten ride data into array of searchable text
export const makeFilterData = (
  rides: RideList[],
): (string | null | undefined)[] => {
  const data = new Set(
    rides.flatMap(({ name, rideGroup, destination }) => [
      name,
      rideGroup,
      destination,
    ]),
  );

  data.delete("");
  data.delete(null);
  data.delete(undefined);
  return Array.from(data).sort();
};

export const hasSpace = (ride: Ride): boolean => {
  const rideLimit = ride.rideLimit ?? -1;
  const hasLimit = rideLimit > -1;

  if (!hasLimit) {
    return true;
  }

  return (ride.users?.length ?? 0) < rideLimit;
};
