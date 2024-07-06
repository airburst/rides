/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { generateRides } from "@/server/actions/generate-rides";
import { getRepeatingRide } from "@/server/actions/get-repeating-ride";
import { getRepeatingRides } from "@/server/actions/get-repeating-rides";
import { type RepeatingRideDb, type RideSet } from "@/types";
import { getNextMonth } from "@utils/dates";
import {
  makeRidesInPeriod,
  repeatingRideToDb,
  updateRRuleStartDate,
} from "@utils/repeatingRides";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * This API is designed to be hit by a scheduled workflow
 * in GitHub.  The cron schedule is for the first of each month
 * and the default is to generate all rides for the following month.
 * You can override that by passing a date in the POST body.
 */
type BodyProps = {
  scheduleId?: string;
  date: string;
};

const getRidesFromTemplates = async ({ scheduleId, date }: BodyProps) => {
  // If we have an id, find one match, else return all templates
  let templates: RepeatingRideDb[] = [];

  if (scheduleId) {
    const result = await getRepeatingRide(scheduleId);

    if (result.ride) {
      const rideWithSchedule = repeatingRideToDb(result.ride);

      templates.push(rideWithSchedule);
    }
  } else {
    const result = await getRepeatingRides();

    templates = result.rides.map((ride) => repeatingRideToDb(ride));
  }

  // For each template, get a list rides to create
  return templates.map((template) => makeRidesInPeriod(template, date));
};

export const createRides = async (rideSet: RideSet[]) => {
  // Map over each array of rides
  const resultPromises = rideSet.map(
    async ({ id, rides, schedule }: RideSet) => {
      if (rides.length === 0) {
        return { scheduleId: id, count: 0 };
      }
      // find the latest date to update template
      const lastDate = rides?.at(-1)?.rideDate;
      const updatedSchedule = updateRRuleStartDate(schedule, lastDate);
      const result = await generateRides(rides, id!, updatedSchedule);

      if (!result.success) {
        return { error: result.message };
      }

      return { scheduleId: id, count: result.createdRides };
    },
  );

  const results = await Promise.all(resultPromises);

  return results;
};

export async function POST(request: Request) {
  const headersList = headers();
  const authorization = headersList.get("authorization");
  const body = await request.json();
  const { date, scheduleId } = body;

  if (authorization === `Bearer ${process.env.API_KEY}`) {
    const generateFromDate = date || getNextMonth();
    const rides = await getRidesFromTemplates({
      scheduleId,
      date: generateFromDate,
    });
    const results = await createRides(rides);
    const totalErrors = results.filter((r) => r.error).length;

    return NextResponse.json(
      {
        success: totalErrors === 0,
        generateFromDate,
        results, // [{ scheduleId, count }]
      },
      { status: 200 },
    );
  } else {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }
}
