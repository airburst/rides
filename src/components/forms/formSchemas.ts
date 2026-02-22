import { z } from "zod";
import { zfd } from "zod-form-data";

//  User
const phoneRegex = new RegExp(
  /([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

export const userProfileFormSchema = z.object({
  id: z.string().trim().min(3, { error: "Id is required" }),
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(3, { error: "Name must contain at least 3 letters" }),
  mobile: z
    .string({ error: "Mobile number is required" })
    .trim()
    .min(3, { error: "Mobile number is required" }),
  emergency: z
    .string({
      error: "An emergency contact (with number) is required",
    })
    .trim()
    .regex(phoneRegex, {
      error: "Emergency contact must include a telephone number",
    })
    .min(11, { error: "Too short for an emergency contact and number" }),
  email: z.string().trim().email({ error: "Invalid email address" }),
  preferences: z.object({
    units: z.string(),
  }),
  role: z.string(),
  membershipId: z.string(),
  membershipStatus: z.string(),
});

export type UserProfileFormSchema = z.output<typeof userProfileFormSchema>;

// Ride
export const rideFormSchema = zfd.formData({
  id: zfd.text(z.string().optional()),
  name: zfd.text(
    z
      .string({ error: "Ride name is required" })
      .trim()
      .min(3, { error: "Ride name must contain at least 3 letters" }),
  ),
  rideDate: zfd.text(z.string({ error: "Ride date is required" })),
  time: zfd.text(z.string()),
  rideGroup: zfd.text(z.string().optional()),
  destination: zfd.text(z.string().optional()),
  meetPoint: zfd.text(z.string().optional()),
  notes: zfd.text(z.string().optional()),
  distance: zfd.numeric(
    z.number().min(10, { error: "Ride must be at least 10km" }),
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
