import type { User } from "@/types";

export type UserResponse = { user: User };

export type UpdateUserInput = {
  name?: string;
  mobile?: string;
  emergency?: string;
  preferences?: Record<string, unknown>;
  role?: "USER" | "LEADER" | "ADMIN";
  membershipId?: string;
  membershipStatus?: string;
};

export type { User };
