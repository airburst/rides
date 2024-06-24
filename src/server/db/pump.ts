import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

config();

const main = async () => {
  const sourceClient = postgres(process.env.SOURCE_URL!);
  const sourceDb = drizzle(sourceClient);

  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client, { schema });

  console.log("Cleaning tables");

  for (const table of [
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
  "createdAt" as created_at
from "User"`);
  //@ts-expect-error data typing
  await db.insert(schema.users).values(usersData);

  // Accounts --------------------------------------------------//
  const accountsData = await sourceDb.execute(sql`SELECT * from "Account"
  where "userId" in (select id from "User")`);
  //@ts-expect-error data typing
  await db.insert(schema.accounts).values(accountsData);

  // Sessions --------------------------------------------------//
  const sessionsData = await sourceDb.execute(sql`select
  "sessionToken",
  "userId",
  "expires"
from "Session"
where "userId" in (select id from "User")
and expires > NOW()`);

  // Convert expires to date
  sessionsData.forEach((session) => {
    //@ts-expect-error data typing
    session.expires = new Date(session.expires);
  });
  //@ts-expect-error data typing
  await db.insert(schema.sessions).values(sessionsData);

  // Rides --------------------------------------------------//
  const ridesData = await sourceDb.execute(sql`SELECT
    id,
    name,
    "group" as "rideGroup",
    "date" as "rideDate",
    destination,
    distance,
    "meetPoint",
    route,
    leader,
    notes,
    speed,
    "limit",
    deleted,
    cancelled,
    "scheduleId",
    "createdAt"
from "Ride"`);
  //@ts-expect-error data typing
  await db.insert(schema.rides).values(ridesData);

  // Users on rides  ---------------------------------------------//
  const uorData = await sourceDb.execute(sql`SELECT * from "UsersOnRides"`);
  //@ts-expect-error data typing
  await db.insert(schema.userOnRides).values(uorData);

  // Repeating rides  ---------------------------------------------//
  const repeatingRidesData = await sourceDb.execute(sql`SELECT
    id,
    name,
    schedule,
    "winterStartTime",
    "group" as "rideGroup",
    destination,
    distance,
    "meetPoint",
    route,
    leader,
    notes,
    speed,
    "limit",
    "createdAt"
from "RepeatingRide"`);
  //@ts-expect-error data typing
  await db.insert(schema.repeatingRides).values(repeatingRidesData);

  // Archived Rides ---------------------------------------------//
  const archivedRidesData = await sourceDb.execute(sql`SELECT
    id,
    name,
    "group" as "rideGroup",
    "date" as "rideDate",
    destination,
    distance,
    "meetPoint",
    route,
    leader,
    notes,
    speed,
    "limit",
    deleted,
    cancelled,
    "createdAt"
  from "ArchivedRide"`);
  //@ts-expect-error data typing
  await db.insert(schema.archivedRides).values(archivedRidesData);

  console.log("Data migration done");
  process.exit(0);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
