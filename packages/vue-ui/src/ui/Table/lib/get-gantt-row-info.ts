import { GANTT_LEFT_SHIFT, MIN_GANTT_TASK_WIDTH } from "../constants";
import type { GanttHeaderInfo, GanttInfo, GanttRowInfo, GanttSize, GanttViewType } from "../types";
import { getGanttCellMonthShift } from "./get-gantt-cell-month-shift";
import { getGanttCellYearShift } from "./get-gantt-cell-year-shift";
import { getGanttColumnWidth } from "./get-gantt-column-width";
import { getGanttRowHeight } from "./get-gantt-row-height";
import { getGanttStartCellByMonth } from "./get-gantt-start-cell-by-month";
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
      startCellLeft = getGanttCellMonthShift(columnWidth * 4, startDate, "start");
      lastCellRight = getGanttCellMonthShift(columnWidth * 4, endDate, "end");
      startCell = getGanttStartCellByMonth(startDate, opts.headerInfoItems);
      startCell *= 4;
      break;
    }

    case "quarters":
    case "months": {
      cellCount = getMonthDiff(startDate, endDate);
      startCellLeft = getGanttCellMonthShift(columnWidth, startDate, "start");
      lastCellRight = getGanttCellMonthShift(columnWidth, endDate, "end");
      startCell = getGanttStartCellByMonth(startDate, opts.headerInfoItems);

      break;
    }
    case "years": {
      cellCount = endDate.getFullYear() - startDate.getFullYear();
      startCellLeft = getGanttCellYearShift(columnWidth, startDate, "start");
      lastCellRight = getGanttCellYearShift(columnWidth, endDate, "end");
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
