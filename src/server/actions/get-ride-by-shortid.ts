"use server";

import { db } from "@/server/db";
import { rides } from "@/server/db/schema";
import { type Ride } from "@/types";
import { formatRideData } from "@utils/rides";
import { and, eq, like } from "drizzle-orm";

/**
 * This is a hacky way to enable short urls for rides.
 * We create a short id with the last 6 characters of the ride id.
 * And match on id with a LIKE clause.
 */
// TODO: preferences
export const getRideByShortId = async (
  shortId: string,
): Promise<{
  ride: Ride | null;
  error?: Error;
}> => {
  try {
    const result = await db.query.rides.findFirst({
      with: {
        users: {
          columns: { notes: true },
          with: {
            user: true,
          },
        },
      },
      where: and(like((rides.id), `%${shortId}`), eq(rides.deleted, false)),
    });

    return {
      ride: formatRideData(result as unknown as Ride) as Ride,
    };
  } catch (error) {
    console.log("🚀 ~ error:", error)
    return {
      ride: null,
      error: new Error(`Unable to fetch ride`),
    };
  }
};
