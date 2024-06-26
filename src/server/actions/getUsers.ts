"use server";

import { db } from "@/server/db";
import { lower, users } from "@/server/db/schema";
import { type User } from "@/types";
import { asc, like, or } from "drizzle-orm";
import { canUseAction } from "../auth";

export const getUsers = async (
  query?: string,
): Promise<{
  users: User[];
  error?: Error;
}> => {
  // Admin only
  const isAuthorised = await canUseAction("ADMIN");
  let result;

  if (!isAuthorised) {
    return {
      users: [],
      error: new Error("Not authorised to use this API"),
    };
  }

  try {
    if (query) {
      result = await db.query.users.findMany({
        columns: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          membershipId: true,
        },
        where: or(
          // @ts-expect-error col type string
          like(lower(users.name), `%${query.toLowerCase()}%`),
          // @ts-expect-error col type string
          like(lower(users.email), `%${query.toLowerCase()}%`),
        ),
        orderBy: [asc(users.name)],
      });
    } else {
      result = await db.query.users.findMany({
        columns: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          membershipId: true,
        },
        orderBy: [asc(users.name)],
      });
    }

    return {
      users: result as unknown as User[],
    };
  } catch (error) {
    return {
      users: [],
      error: new Error(`Unable to fetch users`),
    };
  }
};
