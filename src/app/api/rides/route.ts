import { db } from "@/server/db";
import { rides } from "@/server/db/schema";
import { asc, desc } from "drizzle-orm";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET() {
  return await getRides();
}

const getRides = async () => {
  try {
    const result = await db.query.rides.findMany({
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

    return Response.json(result);
  } catch (error) {
    return new Error("Unable to fetch rides");
  }
};
