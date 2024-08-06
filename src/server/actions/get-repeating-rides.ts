"use server";

import { db } from "@/server/db";
import { repeatingRides } from "@/server/db/schema";
import { type RepeatingRide } from "@/types";
import { repeatingRideFromDb } from "@utils/repeatingRides";
import { asc, desc } from "drizzle-orm";
// import { revalidatePath } from "next/cache";

export const getRepeatingRides = async (): Promise<{
  rides: RepeatingRide[];
  error?: Error;
}> => {
  try {
    const result = await db.query.repeatingRides.findMany({
      orderBy: [asc(repeatingRides.name), desc(repeatingRides.distance)],
    });

    return {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      rides: result.map(({ createdAt, ...ride }) => repeatingRideFromDb(ride)),
    };
  } catch (error) {
    return {
      rides: [],
      error: new Error("Unable to fetch rides"),
    };
  }
};
