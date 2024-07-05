/* eslint-disable no-restricted-syntax */
import {
  type FilterQuery,
  type Group,
  type RideList,
  type User,
} from "../../src/types";
import { formatDate, getNextNWeeks } from "./dates";

const isGoing = (userId: string, users?: { userId: string | undefined }[]) =>
  users?.map((u) => u.userId).includes(userId);

const filterEndDate = (rides: RideList[], weeksAhead = "2") => {
  const endDate = getNextNWeeks(weeksAhead);

  return rides.filter(({ rideDate }) => rideDate <= endDate);
};

const filterOnlyJoined = (rides: RideList[], userId: string) =>
  rides.filter((ride) => isGoing(userId, ride.users));

// NOTE: If you change the filters here, also change the Set
// that holds them in rides.makeFilterData
const filterSearchText = (rides: RideList[], searchText: string) =>
  rides.filter((ride) => {
    const { name, rideGroup, destination } = ride;

    return (
      name?.indexOf(searchText) > -1 ||
      (rideGroup ?? "")?.indexOf(searchText) > -1 ||
      (destination ?? "")?.indexOf(searchText) > -1
    );
  });

const filterRides = (
  data: RideList[],
  filterQuery: FilterQuery,
  user?: User,
): RideList[] => {
  const { onlyJoined, q, weeksAhead } = filterQuery;

  let filteredData: RideList[] = filterEndDate(data, weeksAhead);

  if (!q && !onlyJoined) {
    return filteredData;
  }

  if (onlyJoined && user?.id) {
    filteredData = filterOnlyJoined(filteredData, user.id);
  }
  if (q) {
    filteredData = filterSearchText(filteredData, q);
  }

  return filteredData;
};

const groupByType = (data: RideList[]) => {
  // Group rides by date, then type
  const groupedByName = new Map<string, RideList[]>();

  for (const ride of data) {
    const d = ride.name;
    const rideList = groupedByName.get(d) ?? [];
    rideList.push(ride);
    groupedByName.set(d, rideList);
  }

  return Object.fromEntries(groupedByName);
};

export const groupRides = (
  data: RideList[],
  filterQuery?: FilterQuery,
  user?: User,
): Group[] => {
  // data can be an empty object when db connection is unavailable
  if (!Array.isArray(data)) {
    // eslint-disable-next-line no-console
    console.log("Database error");
  }
  // Group rides by date
  const groupedByDate = new Map<string, RideList[]>();

  // Filter ride list
  const filteredRides = filterQuery
    ? filterRides(data, filterQuery, user)
    : data;

  for (const ride of filteredRides) {
    const d = formatDate(ride.rideDate);
    const rideList = groupedByDate.get(d) ?? [];

    rideList.push(ride);
    groupedByDate.set(d, rideList);
  }
  // Second pass: group by type
  const grouped: Group[] = [];

  groupedByDate.forEach((value, key) => {
    grouped.push({ [key]: groupByType(value) });
  });
  return grouped;
};

export const ungroupRides = (group: Group) =>
  Object.entries(group).flatMap(([date, types]) =>
    Object.entries(types).map(([type, rides]) => ({ date, type, rides })),
  );

export const mapRidesToDate = (rides: RideList[], date: string): RideList[] =>
  rides.filter((r) => r?.rideDate?.startsWith(date));
