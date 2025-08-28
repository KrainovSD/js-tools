import { GANTT_LEFT_SHIFT, MIN_GANTT_TASK_WIDTH } from "../constants";
import type { GanttHeaderInfo, GanttInfo, GanttRowInfo, GanttSize, GanttViewType } from "../types";
import { getDayOfYear } from "./get-day-of-year";
import { getGanttColumnWidth } from "./get-gantt-column-width";
import { getGanttRowHeight } from "./get-gantt-row-height";
import { getMonthDiff } from "./get-month-diff";

type GetGanttRowInfoOptions = {
  ganttView: GanttViewType;
  ganttSize: GanttSize;
  row: GanttInfo<unknown>;
  index: number;
  headerInfoItems: GanttHeaderInfo[];
};

export function getGanttRowInfo(opts: GetGanttRowInfoOptions): GanttRowInfo {
  const columnWidth = getGanttColumnWidth(opts.ganttView);
  const rowHeight = getGanttRowHeight(opts.ganttSize);

  /** Bad solution activated */
  const textWidth = opts.row.name.length * 6.5 + 20;
  const top = opts.index * rowHeight + rowHeight / 2;

  let height = rowHeight / 2;
  if (opts.row.type === "milestone") {
    height /= 1.5;
  }

  let cellCount = 0;
  let startCellLeft = 0;
  let lastCellRight = 0;
  let startCell = 0;

  const startDate = new Date(opts.row.start);
  const endDate = new Date(opts.row.end);
  switch (opts.ganttView) {
    case "weeks": {
      cellCount = getMonthDiff(startDate, endDate) * 4;
      startCellLeft = ((columnWidth * 4) / 31) * startDate.getDate();
      lastCellRight = ((columnWidth * 4) / 31) * endDate.getDate();

      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth();
      if (opts.headerInfoItems[0]?.year < startYear) {
        /** Extract months from first year, all months from between years and include all until current month from current year  */
        startCell = opts.headerInfoItems[0].months.length;
        const diff = startYear - opts.headerInfoItems[0].year - 1;
        for (let i = 0; i < diff; i++) {
          startCell += 12;
        }
        startCell += startMonth;
      } else {
        /** Extract months from first year until current month */
        startCell = startMonth - opts.headerInfoItems[0]?.months?.[0];
      }

      startCell *= 4;
      break;
    }

    case "quarters":
    case "months": {
      cellCount = getMonthDiff(startDate, endDate);
      startCellLeft = (columnWidth / 31) * startDate.getDate();
      lastCellRight = (columnWidth / 31) * endDate.getDate();

      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth();
      if (opts.headerInfoItems[0]?.year < startYear) {
        /** Extract months from first year, all months from between years and include all until current month from current year  */
        startCell = opts.headerInfoItems[0].months.length;
        const diff = startYear - opts.headerInfoItems[0].year - 1;
        for (let i = 0; i < diff; i++) {
          startCell += 12;
        }
        startCell += startMonth;
      } else {
        /** Extract months from first year until current month */
        startCell = startMonth - opts.headerInfoItems[0]?.months?.[0];
      }

      break;
    }
    case "years": {
      cellCount = endDate.getFullYear() - startDate.getFullYear();
      startCellLeft = (columnWidth / 365) * getDayOfYear(startDate);
      lastCellRight = (columnWidth / 365) * getDayOfYear(endDate);

      startCell = startDate.getFullYear() - opts.headerInfoItems[0]?.year;

      break;
    }
    default: {
      break;
    }
  }

  let width = cellCount * columnWidth + lastCellRight - startCellLeft;
  if (width < MIN_GANTT_TASK_WIDTH) width = MIN_GANTT_TASK_WIDTH;
  if (opts.row.type === "milestone") {
    width = height;
  }

  const left = startCell * columnWidth + startCellLeft - GANTT_LEFT_SHIFT;

  return {
    height,
    index: opts.index,
    left,
    textWidth,
    top,
    width,
  };
}
