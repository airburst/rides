import { sql, type SQL } from "drizzle-orm";
import { type AnyPgColumn } from "drizzle-orm/pg-core";

export { accountRelations, default as accounts } from "./account";
export {
  archivedRideRelations,
  default as archivedRides,
} from "./archivedRide";
export {
  default as archivedUserOnRides,
  archivedUserOnRidesRelations,
} from "./archivedUsersOnRide";
export { membershipRelations, default as memberships } from "./membership";
export {
  repeatingRideRelations,
  default as repeatingRides,
} from "./repeatingRide";
export { rideRelations, default as rides } from "./ride";
export { sessionRelations, default as sessions } from "./session";
export { roleEnum, userRelations, default as users } from "./user";
export { default as userOnRides, userOnRidesRelations } from "./usersOnRide";
export { default as verificationTokens } from "./verificationToken";

export function lower(col: AnyPgColumn): SQL {
  return sql`lower(${col})`;
}
