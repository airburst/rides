/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getNextMonth } from "@utils/dates";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createRides, getRidesFromTemplates } from "./utils";

/**
 * This API is designed to be hit by a scheduled workflow
 * in GitHub.  The cron schedule is for the first of each month
 * and the default is to generate all rides for the following month.
 * You can override that by passing a date in the POST body.
 */
export type GenerateApiResponse = {
  success: boolean;
  generateFromDate?: string;
  message?: string;
  results?: {
    scheduleId?: string;
    count?: number;
    error?: string;
  }[];
};

export async function POST(
  request: Request,
): Promise<NextResponse<GenerateApiResponse>> {
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
