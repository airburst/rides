export * from "./days";
export * from "./preferences";

// [5 .. 50] rider limit bounds
export const RIDER_LIMIT_OPTIONS: number[] = Array.from(Array(45).keys()).map(
  (x) => x + 5
);
