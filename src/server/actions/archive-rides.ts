"use server";

import { db } from "@/server/db";
import { eq, lt, sql } from "drizzle-orm";
import {
  archivedRides,
  archivedUserOnRides,
  rides,
  userOnRides,
} from "../db/schema";

export const archiveRides = async (date: string) => {
  let movedRides = [];
  let movedRiders = [];

  try {
    await db.transaction(async (tx) => {
      movedRides = await tx
        .select()
        .from(rides)
        .where(lt(rides.rideDate, date));

      movedRiders = await tx
        .select({
          rideId: userOnRides.rideId,
          userId: userOnRides.userId,
          notes: userOnRides.notes,
          createdAt: userOnRides.createdAt,
        })
        .from(userOnRides)
        .innerJoin(rides, eq(userOnRides.rideId, rides.id))
        .where(lt(rides.rideDate, date));

      // Insert archived rides
      if (movedRides.length > 0) {
        await tx.insert(archivedRides).values(movedRides);
      }
      // Insert archived riders
      if (movedRiders.length > 0) {
        await tx.insert(archivedUserOnRides).values(movedRiders);
      }

      // Delete riders
      await tx.execute(
        sql`delete from "bcc_users_on_rides" where "ride_id" IN (select id from "bcc_rides" where "ride_date" < TO_TIMESTAMP(${date}, 'YYYY-MM-DD'))`,
      );

      // Delete rides
      await tx.execute(
        sql`delete from "bcc_rides" where "ride_date" < TO_TIMESTAMP(${date}, 'YYYY-MM-DD')`,
      );
    });

    return {
      movedRides: movedRides.length,
      movedRiders: movedRiders.length,
    };
  } catch (error) {
    console.error("🚀 ~ archiveRides ~ error:", error);
    return {
      success: false,
      message: `Unable to archive rides`,
    };
  }
};
