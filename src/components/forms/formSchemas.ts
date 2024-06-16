import { z } from "zod";

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
});

export type UserProfileFormSchema = z.output<typeof userProfileFormSchema>;
