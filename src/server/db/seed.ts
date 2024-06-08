import { config } from "dotenv";
// import { drizzle } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as seeds from "./seeds";

config();

if (!("DATABASE_URL" in process.env))
  throw new Error("DATABASE_URL not found on .env.development");

if (!process.env.DB_SEEDING) {
  throw new Error('You must set DB_SEEDING to "true" when running seeds');
}

const main = async () => {
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
    // await resetTable(table);
  }

  console.log("Seeding started");

  await seeds.users(db);
  await seeds.sessions(db);
  await seeds.accounts(db);

  console.log("Seeding done");
  process.exit(0);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
