import { DEFAULT_PREFERENCES } from "../../src/constants";
import type { User, Preferences } from "../../src/types";

export const getPreferences = (user: User): Preferences => {
  const preferences = user.preferences!;

  return {
    ...DEFAULT_PREFERENCES,
    ...preferences,
  };
};
