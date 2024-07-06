"use server";

import { type GenerateApiResponse } from "@/app/api/generate/route";
import { env } from "@/env";

/**
 * NOTE: This action is designed to be called from
 * the copy ride page
 */
export const generateRidesFromClient = async (
  scheduleId: string,
  date: string,
) => {
  try {
    const response: GenerateApiResponse = (await fetch(
      `${env.HOST_URL}/api/generate`,
      {
        method: "POST",
        body: JSON.stringify({ scheduleId, date }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${env.API_KEY}`,
        },
      },
    ).then((res) => res.json())) as GenerateApiResponse;

    const createdRides = response?.results?.[0]?.count ?? 0;

    return {
      success: response?.success,
      createdRides,
      message: `Generated ${createdRides} rides`,
    };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return {
      success: false,
      message: `Unable to generate rides`,
    };
  }
};
