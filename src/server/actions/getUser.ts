"use server";

import { db } from "@/server/db";
import { type User } from "@/types";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";

export const getUser = async (
  id: string,
): Promise<{
  user: User | null;
  error?: Error;
}> => {
  try {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    return {
      user: result as unknown as User,
    };
  } catch (error) {
    return {
      user: null,
      error: new Error(`Unable to fetch ride id ${id}`),
    };
  }
};
