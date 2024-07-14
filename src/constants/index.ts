export * from "./days";
export * from "./errors";
export * from "./preferences";

// [5 .. 50] rider limit bounds
export const RIDER_LIMIT_OPTIONS: number[] = Array.from(Array(45).keys()).map(
  (x) => x + 5,
);

export const DATABASE_PREFIX = "bcc_";

export const MAX_FILE_SIZE_IN_BYTES = 4 * 1024 * 1024; // 4mb
