"use server";

import { db } from "@/server/db";
import { type User } from "@/types";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";

type UserUpdate = Pick<
  User,
  "id" | "name" | "mobile" | "emergency" | "preferences"
>;

export const updateUser = async (
  user: UserUpdate,
): Promise<{
  id: string | null;
  error?: Error;
}> => {
  const { id, name, mobile, emergency, preferences } = user;

  try {
    const result = await db
      .update(users)
      .set({ name, mobile, emergency, preferences })
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
