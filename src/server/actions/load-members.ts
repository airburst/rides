"use server";

import { type Member } from "@/app/api/riderhq/types";
import { db } from "@/server/db";
import { memberships } from "@/server/db/schema";
import { type FormState } from "./update-profile";

export const loadMembers = async (members: Member[]): Promise<FormState> => {
  try {
    // Truncate and fill the table within a transaction
    await db.transaction(async (tx) => {
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      await tx.delete(memberships);
      // @ts-expect-error - insert is not yet typed
      await tx.insert(memberships).values(members);
    });

    return {
      success: true,
      message: "Ride added",
    };
  } catch (error) {
    return {
      success: false,
      message: `Unable to add ride`,
    };
  }
};
