import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

config();

const main = async () => {
  const sourceDb = drizzle(process.env.SOURCE_URL!, {
    schema,
    casing: "snake_case",
  });
  const db = drizzle(process.env.DATABASE_URL!, {
    schema,
    casing: "snake_case",
  });

  console.log("Cleaning tables");

  for (const table of [
    schema.archivedUserOnRides,
    schema.archivedRides,
    schema.sessions,
    schema.accounts,
    schema.userOnRides,
    schema.rides,
    schema.repeatingRides,
    schema.users,
  ]) {
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    await db.delete(table); // clear tables without truncating / resetting ids
  }

  console.log("Data migration started");

  // Users --------------------------------------------------//
  const usersData = await sourceDb.execute(sql`select
  id,
  name,
  email,
  image,
  mobile,
  emergency,
  role,
  preferences,
  membership_id as "membershipId",
  membership_status as "membershipStatus"
from "bcc_users"`);

  //@ts-expect-error data typing
  await db.insert(schema.users).values(usersData);
  console.log("Users migrated", usersData.length);

  // Accounts --------------------------------------------------//
  const accountsData = await sourceDb.execute(
    // sql`SELECT * from "bcc_accounts"`,
    sql`SELECT
  user_id as "userId",
  type,
  provider,
  provider_account_id as "providerAccountId",
  refresh_token,
  access_token,
  expires_at,
  token_type,
  scope,
  id_token,
  session_state
from "bcc_accounts"`,
  );
  //@ts-expect-error data typing
  await db.insert(schema.accounts).values(accountsData);
  console.log("Accounts migrated", accountsData.length);

  // Sessions --------------------------------------------------//
  const sessionsData = await sourceDb.execute(sql`select
  user_id as "userId",
  session_token as "sessionToken",
  expires
from "bcc_sessions"
where expires > NOW()`);

  // Convert expires to date
  sessionsData.forEach((session) => {
    //@ts-expect-error data typing
    session.expires = new Date(session.expires);
  });
  //@ts-expect-error data typing
  await db.insert(schema.sessions).values(sessionsData);
  console.log("Sessions migrated", sessionsData.length);

  // Rides --------------------------------------------------//
  // const ridesData = await db.execute(sql`SELECT * from "bcc_rides"`);
  const ridesData = await sourceDb.execute(sql`SELECT
  id,
  name,
  ride_group as "rideGroup",
  ride_date as "rideDate",
  destination,
  distance,
  meet_point as "meetPoint",
  route,
  leader,
  notes,
  ride_limit as "rideLimit",
  deleted,
  cancelled,
  schedule_id as "scheduleId",
  created_at as "createdAt",
  updated_at as "updatedAt"
from "bcc_rides"`);
  //@ts-expect-error data typing
  await db.insert(schema.rides).values(ridesData);
  console.log("Rides migrated", ridesData.length);

  // Users on rides  ---------------------------------------------//
  const uorData = await sourceDb.execute(sql`SELECT
  user_id as "userId",
  ride_id as "rideId",
  notes,
  created_at as "createdAt"
from "bcc_users_on_rides"`);
  //@ts-expect-error data typing
  await db.insert(schema.userOnRides).values(uorData);
  console.log("Users on rides migrated", uorData.length);

  // Repeating rides  ---------------------------------------------//
  const repeatingRidesData = await sourceDb.execute(
    sql`SELECT * from "bcc_repeating_rides"`,
  );
  //@ts-expect-error data typing
  await db.insert(schema.repeatingRides).values(repeatingRidesData);
  console.log("Repeating rides migrated", repeatingRidesData.length);

  // Archived Rides ---------------------------------------------//
  const archivedRidesData = await sourceDb.execute(
    sql`SELECT
  id,
  name,
  ride_group as "rideGroup",
  ride_date as "rideDate",
  destination,
  distance,
  meet_point as "meetPoint",
  route,
  leader,
  notes,
  ride_limit as "rideLimit",
  deleted,
  cancelled,
  created_at as "createdAt"
from "bcc_archived_rides"`,
  );
  //@ts-expect-error data typing
  await db.insert(schema.archivedRides).values(archivedRidesData);
  console.log("Archived rides migrated", archivedRidesData.length);

  // Users on rides  ---------------------------------------------//
  const archivedUorData = await sourceDb.execute(sql`SELECT
  user_id as "userId",
  ride_id as "rideId",
  notes,
  created_at as "createdAt"
from "bcc_archived_users_on_rides"`);
  //@ts-expect-error data typing
  await db.insert(schema.archivedUserOnRides).values(archivedUorData);
  console.log("Archived users on rides migrated", archivedUorData.length);

  console.log("Data migration done");
  process.exit(0);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
