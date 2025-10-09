import { getDaysInMonth } from "./get-days-in-month";

export function getGanttCellMonthShift(columnWidth: number, date: Date, type: "start" | "end") {
  const day = type === "start" ? date.getDate() - 1 : date.getDate();

  return (columnWidth / getDaysInMonth(date.getFullYear(), date.getMonth())) * day;
}
