"use server";

import { db } from "@/server/db";
import { rides } from "@/server/db/schema";
import { type Ride } from "@/types";
import { formatRideData } from "@utils/rides";
import { and, eq } from "drizzle-orm";

export const getRide = async (
  id: string,
): Promise<{
  ride: Ride | null;
  error?: Error;
}> => {
  try {
    const result = await db.query.rides.findFirst({
      with: {
        users: {
          columns: {},
          with: {
            user: true,
          },
        },
      },
      where: and(eq(rides.id, id), eq(rides.deleted, false)),
    });

    return {
      ride: formatRideData(result as unknown as Ride) as Ride,
    };
  } catch (error) {
    return {
      ride: null,
      error: new Error(`Unable to fetch ride id ${id}`),
    };
  }
};
