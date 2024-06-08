import type db from "..";
import { sessions } from "../schema";
import data from "./data/session.json";

export default async function seed(db: db) {
  // Change date strings to Date objects
  const dataToInsert = data.map((session) => {
    const { expires, ...rest } = session;
    return {
      ...rest,
      expires: new Date(expires),
    };
  });

  await db.insert(sessions).values(dataToInsert);
}
