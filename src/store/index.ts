import { atom } from "jotai";
import { type FilterQuery } from "../types";

export const showFilterAtom = atom(false);

export const filterQueryAtom = atom<FilterQuery>({});

export const isCancelledAtom = atom(false);

// Export optimistic ride update atoms
export * from "./rideOptimisticUpdates";
