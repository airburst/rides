import {
  daysInMonth,
  firstDayOfMonth,
  getDateStub,
  getLastMonth,
  getNextMonth,
  getNow,
} from "./dates";

export const generateCalendar = (date: string) => {
  const today = getNow().split("T")[0] ?? "";
  const startDay = firstDayOfMonth(date);
  const lastDay = daysInMonth(date);
  const calGrid = [];

  // If first day > 0 (Sunday) we need to include days from end of previous month
  if (startDay > 0) {
    const lastMonth = getLastMonth(date);
    const endOfLastMonth = daysInMonth(lastMonth);

    for (let pd = 0; pd < startDay; pd += 1) {
      const day = endOfLastMonth - startDay + pd + 1;
      const calDate = `${getDateStub(lastMonth)}-${day
        .toString()
        .padStart(2, "0")}`;

      calGrid.push({
        type: calDate >= today ? "future" : "historic",
        day,
        date: calDate,
      });
    }
  }

  // Add all of the days in month
  for (let d = 1; d < lastDay + 1; d += 1) {
    const calDate = `${getDateStub(date)}-${d.toString().padStart(2, "0")}`;
    calGrid.push({
      type: calDate >= today ? "future" : "historic",
      day: d,
      date: calDate,
    });
  }

  // Fill up final week with next month
  const remainder = calGrid.length % 7;

  if (remainder > 0) {
    const nextMonth = getNextMonth(date);

    for (let nd = 1; nd < 8 - remainder; nd += 1) {
      const calDate = `${getDateStub(nextMonth)}-${nd
        .toString()
        .padStart(2, "0")}`;

      calGrid.push({
        type: calDate >= today ? "future" : "historic",
        day: nd,
        date: calDate,
      });
    }
  }

  return calGrid;
};
