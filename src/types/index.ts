export type Preferences = {
  units: "km" | "miles";
};

export type Role = "USER" | "LEADER" | "ADMIN";

export type User = {
  id: string;
  name: string;
  email: string;
  mobile?: string | null;
  emergency?: string | null;
  image?: string | null; // url
  role: Role;
  preferences?: Preferences;
  rideNotes?: string;
};

export type Session = {
  user?: {
    id: string;
    role: Role;
    preferences?: Preferences;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: string;
};

export type DbResponse<T> = {
  data?: T[];
  error?: string;
  loading?: boolean;
};

export type Ride = {
  id?: string;
  name: string;
  rideDate: string;
  destination?: string | null;
  rideGroup?: string | null;
  distance?: number | string | null;
  meetPoint?: string | null;
  route?: string | null;
  leader?: string | null;
  speed?: number | null;
  notes?: string | null;
  cancelled?: boolean;
  limit?: number;
  scheduleId?: string;
  createdAt: string;
  users?: { user: User }[];
  day?: string;
  time?: string;
};

export type RideList = Omit<Ride, "users"> & {
  users?: { userId: string }[];
};

export type RideNote = {
  name: string;
  rideNotes: string | undefined;
  image?: string | null;
};

export type RepeatingRide = {
  id?: string;
  name: string;
  freq: number;
  interval?: number;
  byweekday?: number | number[] | null;
  bysetpos?: number | number[] | null;
  bymonth?: number | number[] | null;
  bymonthday?: number | number[] | null;
  textRule?: string;
  startDate: string;
  winterStartTime?: string | null;
  endDate?: string | null;
  destination?: string | null;
  group?: string | null;
  distance?: number | null;
  meetPoint?: string | null;
  route?: string | null;
  leader?: string | null;
  speed?: number | null;
  notes?: string | null;
  cancelled?: boolean;
  limit?: number;
};

export type RepeatingRideDb = Omit<
  RepeatingRide,
  | "freq"
  | "interval"
  | "startDate"
  | "endDate"
  | "byweekday"
  | "bysetpos"
  | "bymonth"
  | "bymonthday"
> & {
  schedule: string;
};

export type PartialRide = Omit<Ride, "day" | "date" | "time"> & {
  time?: string;
};

export type TemplateRide = PartialRide & {
  date: string;
};

export type Riders = {
  name: string;
  mobile?: string;
};

export type Group = Record<string, Record<string, RideList[]>>;

export type StartTime = {
  hour: number;
  minute: number;
};

export type SeasonStartTime = {
  winter: StartTime;
  summer: StartTime;
};

export type FilterQuery = {
  onlyJoined?: boolean;
  q?: string;
  weeksAhead?: string;
};

//  Forms
export type RideFormValues = {
  id?: string;
  name: string;
  date: string;
  time: string;
  group?: string;
  destination?: string;
  meetPoint?: string;
  notes?: string;
  distance: number;
  leader: string;
  route: string;
  limit?: number;
  // Repeating ride
  interval?: number;
  freq: number;
  startDate: string;
  endDate?: string;
  winterStartTime?: string;
  byweekday?: number;
  bysetpos?: number;
  bymonth?: number;
  bymonthday?: number;
};
