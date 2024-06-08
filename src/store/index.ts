import { atom } from "jotai";
import { FilterQuery } from "../types";

export const showFilterAtom = atom(false);

export const filterQueryAtom = atom<FilterQuery>({});
