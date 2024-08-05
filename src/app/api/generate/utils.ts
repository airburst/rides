/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { generateRides } from "@/server/actions/generate-rides";
import { getRepeatingRide } from "@/server/actions/get-repeating-ride";
import { getRepeatingRides } from "@/server/actions/get-repeating-rides";
import { type RepeatingRideDb, type RideSet } from "@/types";
import {
  makeRidesInPeriod,
  repeatingRideToDb,
  updateRRuleStartDate,
} from "@utils/repeatingRides";

type BodyProps = {
  scheduleId?: string;
  date: string;
};

export const getRidesFromTemplates = async ({
  scheduleId,
  date,
}: BodyProps) => {
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

  // const results = await Promise.all(resultPromises);
  // Execute each transaction promise sequentially
  const results = [];
  for (const promise of resultPromises) {
    try {
        const result = await promise;
        results.push(result)
        console.log("🚀 ~ createRides:", result)
    } catch (error) {
        console.log(error);
    }
  }

  return results;
};
