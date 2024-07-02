import { pgGenerate } from "drizzle-dbml-generator"; // Using Postgres for this example
import * as schema from "./schema";

const out = "./drizzle/schema.dbml";
const relational = true;

pgGenerate({ schema, out, relational });

// Now view generated DBML file at
// https://dbdiagram.io/d
