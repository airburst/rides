import { db } from "@/server/db";
import { rides } from "@/server/db/schema";
import { type RideList } from "@/types";
import { formatRideData } from "@utils/rides";
import { asc, desc } from "drizzle-orm";

export const getRides = async (): Promise<{
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
          // with: {
          //   user: {
          //     columns: {
          //       id: true,
          //       name: true,
          //     },
          //   },
          // },
        },
      },
      // where: and(
      //   lt(rides.date, end),
      //   gt(rides.date, start),
      //   eq(rides.deleted, false)
      // ),
      orderBy: [asc(rides.rideDate), asc(rides.name), desc(rides.distance)],
    });

    return {
      rides: result.map((ride) => formatRideData(ride as unknown as RideList)),
    };
  } catch (error) {
    return {
      rides: [],
      error: new Error("Unable to fetch rides"),
    };
  }
};
