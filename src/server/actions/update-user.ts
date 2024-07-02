"use server";

import { db } from "@/server/db";
import { type User } from "@/types";
import { eq } from "drizzle-orm";
import { canUseAction } from "../auth";
import { users } from "../db/schema";

type UserUpdate = Pick<
  User,
  "id" | "name" | "mobile" | "emergency" | "preferences" | "role"
>;

export const updateUser = async (
  user: UserUpdate,
): Promise<{
  id: string | null;
  error?: Error;
}> => {
  // A user can only change their own record; an admin can change other riders
  const isAuthorised = await canUseAction("ADMIN", user.id);

  if (!isAuthorised) {
    return {
      id: null,
      error: new Error("Not authorised to use this API"),
    };
  }

  const { id, name, mobile, emergency, preferences, role } = user;

  try {
    const result = await db
      .update(users)
      .set({ name, mobile, emergency, preferences, role })
      .where(eq(users.id, id))
      .returning({ id: users.id });

    return {
      id: result?.[0]?.id ?? null,
    };
  } catch (error) {
    return {
      id: null,
      error: new Error(`Unable to update user id ${id}`),
    };
  }
};
