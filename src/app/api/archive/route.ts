import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const headersList = headers();
  const authorization = headersList.get("authorization");

  if (authorization === `Bearer ${process.env.API_KEY}`) {
    // TODO: Implement generating rides

    return NextResponse.json(
      {
        success: true,
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
