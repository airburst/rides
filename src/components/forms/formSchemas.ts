import { z } from "zod";
import { zfd } from "zod-form-data";

//  User
export const userProfileFormSchema = z.object({
  id: z.string().trim().min(3, { message: "Id is required" }),
  name: z.string().trim().min(3, { message: "Name is required" }),
  mobile: z.string().trim().min(3, { message: "Mobile number is required" }),
  emergency: z
    .string()
    .trim()
    .min(3, { message: "Emergency contact is required" }),
  email: z.string().trim().email({ message: "Invalid email address" }),
  preferences: z.object({
    units: z.string(),
  }),
  role: z.string(),
});

export type UserProfileFormSchema = z.output<typeof userProfileFormSchema>;

// Ride
export const rideFormSchema = zfd.formData({
  id: zfd.text(z.string().optional()),
  name: zfd.text(
    z
      .string({ required_error: "Ride name is required" })
      .trim()
      .min(3, { message: "Ride name must contain at least 3 letters" }),
  ),
  rideDate: zfd.text(z.string({ required_error: "Ride date is required" })),
  time: zfd.text(z.string()),
  rideGroup: zfd.text(z.string().optional()),
  destination: zfd.text(z.string().optional()),
  meetPoint: zfd.text(z.string().optional()),
  notes: zfd.text(z.string().optional()),
  distance: zfd.numeric(
    z.number().min(10, { message: "Ride must be at least 10km" }),
  ),
  leader: zfd.text(z.string().optional()),
  route: zfd.text(z.string().optional()),
  rideLimit: zfd.numeric(),
  // Repeating ride
  interval: zfd.numeric(z.number().optional()),
  freq: zfd.numeric(),
  startDate: zfd.text(z.string().optional()), // Mandatory for repeating rides
  endDate: zfd.text(z.string().trim().optional()),
  winterStartTime: zfd.text(z.string().trim().optional()),
  byweekday: zfd.numeric(z.number().optional()),
  bysetpos: zfd.numeric(z.number().optional()),
  bymonth: zfd.numeric(z.number().optional()),
  bymonthday: zfd.numeric(z.number().optional()),
});

export type RideFormSchema = z.output<typeof rideFormSchema>;
