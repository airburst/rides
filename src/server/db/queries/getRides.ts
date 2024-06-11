import { FOREVER } from "@/constants";
import { db } from "@/server/db";
import { rides } from "@/server/db/schema";
import { type RideList } from "@/types";
import { getNow } from "@utils/dates";
import { formatRideData } from "@utils/rides";
import { and, asc, desc, eq, gt, lt } from "drizzle-orm";

export const getRides = async (
  start: string = getNow(),
  end: string = FOREVER,
): Promise<{
  rides: RideList[];
  error?: Error;
}> => {
  try {
    const result = await db.query.rides.findMany({
      columns: {
        id: true,
        name: true,
        rideGroup: true,
        rideDate: true,
        destination: true,
        distance: true,
        limit: true,
        cancelled: true,
        createdAt: true,
      },
      with: {
        users: {
          columns: {
            userId: true,
          },
        },
      },
      where: and(
        lt(rides.rideDate, end),
        gt(rides.rideDate, start),
        eq(rides.deleted, false),
      ),
      orderBy: [asc(rides.rideDate), asc(rides.name), desc(rides.distance)],
    });

    return {
      rides: result.map((ride) =>
        formatRideData(ride as unknown as RideList),
      ) as RideList[],
    };
  } catch (error) {
    return {
      rides: [],
      error: new Error("Unable to fetch rides"),
    };
  }
};
