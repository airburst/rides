/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { archiveRides } from "@/server/actions/archive-rides";
import { getNow } from "@utils/dates";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const headersList = headers();
  const authorization = headersList.get("authorization");
  const body = await request.json();
  const { date } = body;

  if (authorization === `Bearer ${process.env.API_KEY}`) {
    const runDate = date ? new Date(date as string).toISOString() : getNow();

    const archiveResults = await archiveRides(runDate);

    return NextResponse.json(
      {
        success: true,
        runDate,
        archiveResults,
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
