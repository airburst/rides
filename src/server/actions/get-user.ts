"use server";

import { NOT_AUTHORISED } from "@/constants";
import { db } from "@/server/db";
import { type User } from "@/types";
import { eq } from "drizzle-orm";
import { canUseAction } from "../auth";
import { users } from "../db/schema";

export const getUser = async (
  id: string,
): Promise<{
  user: User | null;
  error?: string;
}> => {
  // A user can only update their own record
  const isAuthorised = await canUseAction("ADMIN", id);

  if (!isAuthorised) {
    return {
      user: null,
      error: NOT_AUTHORISED,
    };
  }

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
      error: `Unable to fetch ride id ${id}`,
    };
  }
};
