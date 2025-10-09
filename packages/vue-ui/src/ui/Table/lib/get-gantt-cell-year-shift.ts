import { getDaysInYear } from "./get-days-in-year";
import { getPassedDaysOfYear } from "./get-passed-days-of-year";

export function getGanttCellYearShift(columnWidth: number, date: Date, type: "start" | "end") {
  const day = type === "start" ? getPassedDaysOfYear(date) - 1 : getPassedDaysOfYear(date);

  return (columnWidth / getDaysInYear(date.getFullYear())) * day;
}
