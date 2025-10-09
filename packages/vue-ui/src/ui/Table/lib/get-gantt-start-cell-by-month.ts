import type { GanttHeaderInfo } from "../types";

export function getGanttStartCellByMonth(date: Date, headerInfo: GanttHeaderInfo[]) {
  const startYear = date.getFullYear();
  const startMonth = date.getMonth();
  let startCell = 0;

  if (headerInfo[0]?.year < startYear) {
    /** Extract months from first year, all months from between years and include all until current month from current year  */
    startCell = headerInfo[0].months.length;
    const diff = startYear - headerInfo[0].year - 1;
    for (let i = 0; i < diff; i++) {
      startCell += 12;
    }
    startCell += startMonth;
  } else {
    /** Extract months from first year until current month */
    startCell = startMonth - headerInfo[0]?.months?.[0];
  }

  return startCell;
}
