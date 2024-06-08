import { env } from "@/env";
import { getTableName, sql, type Table } from "drizzle-orm";
import { conn, db } from ".";
import * as schema from "./schema";
import * as seeds from "./seeds";

if (!env.DB_SEEDING) {
  throw new Error('You must set DB_SEEDING to "true" when running seeds');
}

async function resetTable(db: db, table: Table) {
  return db.execute(
    sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`),
  );
}

for (const table of [
  schema.sessions,
  schema.accounts,
  schema.userOnRides,
  schema.rides,
  schema.repeatingRides,
  schema.users,
]) {
  // await db.delete(table); // clear tables without truncating / resetting ids
  await resetTable(db, table);
}

await seeds.users(db);
await seeds.sessions(db);
await seeds.accounts(db);

await conn.end();
