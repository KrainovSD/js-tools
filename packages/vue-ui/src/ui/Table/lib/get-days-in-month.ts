import { GANTT_MONTH_DAYS } from "../constants";
import { getDaysInYear } from "./get-days-in-year";

export function getDaysInMonth(year: number, month: number) {
  if (month === 1) {
    const daysInYear = getDaysInYear(year);

    return daysInYear === 365 ? 28 : 29;
  }

  return GANTT_MONTH_DAYS[month];
}
