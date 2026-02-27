import { DEFAULT_PREFERENCES } from "@/constants";
import { type User, type Preferences } from "@/types";

export const getPreferences = (user: User): Preferences => {
  const preferences = user.preferences!;

  return {
    ...DEFAULT_PREFERENCES,
    ...preferences,
  };
};
