import { GANTT_LEFT_SHIFT, MIN_GANTT_TASK_WIDTH } from "../constants";
import type { GanttHeaderInfo, GanttInfo, GanttRowInfo, GanttViewType } from "../types";
import { getGanttCellMonthShift } from "./get-gantt-cell-month-shift";
import { getGanttCellYearShift } from "./get-gantt-cell-year-shift";
import { getGanttColumnWidth } from "./get-gantt-column-width";
import { getGanttStartCellByMonth } from "./get-gantt-start-cell-by-month";
import { getMonthDiff } from "./get-month-diff";

type GetGanttRowInfoOptions = {
  ganttView: GanttViewType;
  row: GanttInfo<unknown>;
  index: number;
  headerInfoItems: GanttHeaderInfo[];
};

export function getGanttRowInfo(opts: GetGanttRowInfoOptions): GanttRowInfo {
  const columnWidth = getGanttColumnWidth(opts.ganttView);

  /** Bad solution activated */
  const textWidth = opts.row.name.length * 6.5 + 20;

  let cellCount = 0;
  let startCellLeft = 0;
  let lastCellRight = 0;
  let startCell = 0;
  let actualCellCount = 0;
  let actualStartCellLeft = 0;
  let actualLastCellRight = 0;
  let actualStartCell = 0;

  const startDate = new Date(opts.row.start);
  const endDate = new Date(opts.row.end);
  const actualStartDate = new Date(opts.row.actualStart ?? "");
  const actualEndDate = new Date(opts.row.actualEnd ?? "");
  const actual = !Number.isNaN(actualStartDate.getTime()) && !Number.isNaN(actualEndDate.getTime());

  switch (opts.ganttView) {
    case "weeks": {
      cellCount = getMonthDiff(startDate, endDate) * 4;
      startCellLeft = getGanttCellMonthShift(columnWidth * 4, startDate, "start");
      lastCellRight = getGanttCellMonthShift(columnWidth * 4, endDate, "end");
      startCell = getGanttStartCellByMonth(startDate, opts.headerInfoItems);
      startCell *= 4;

      if (actual) {
        actualCellCount = getMonthDiff(actualStartDate, actualEndDate) * 4;
        actualStartCellLeft = getGanttCellMonthShift(columnWidth * 4, actualStartDate, "start");
        actualLastCellRight = getGanttCellMonthShift(columnWidth * 4, actualEndDate, "end");
        actualStartCell = getGanttStartCellByMonth(actualStartDate, opts.headerInfoItems);
        actualStartCell *= 4;
      }

      break;
    }

    case "quarters":
    case "months": {
      cellCount = getMonthDiff(startDate, endDate);
      startCellLeft = getGanttCellMonthShift(columnWidth, startDate, "start");
      lastCellRight = getGanttCellMonthShift(columnWidth, endDate, "end");
      startCell = getGanttStartCellByMonth(startDate, opts.headerInfoItems);

      if (actual) {
        actualCellCount = getMonthDiff(actualStartDate, actualEndDate);
        actualStartCellLeft = getGanttCellMonthShift(columnWidth, actualStartDate, "start");
        actualLastCellRight = getGanttCellMonthShift(columnWidth, actualEndDate, "end");
        actualStartCell = getGanttStartCellByMonth(actualStartDate, opts.headerInfoItems);
      }

      break;
    }
    case "years": {
      cellCount = endDate.getFullYear() - startDate.getFullYear();
      startCellLeft = getGanttCellYearShift(columnWidth, startDate, "start");
      lastCellRight = getGanttCellYearShift(columnWidth, endDate, "end");
      startCell = startDate.getFullYear() - opts.headerInfoItems[0]?.year;

      if (actual) {
        actualCellCount = actualEndDate.getFullYear() - actualStartDate.getFullYear();
        actualStartCellLeft = getGanttCellYearShift(columnWidth, actualStartDate, "start");
        actualLastCellRight = getGanttCellYearShift(columnWidth, actualEndDate, "end");
        actualStartCell = actualStartDate.getFullYear() - opts.headerInfoItems[0]?.year;
      }

      break;
    }
    default: {
      break;
    }
  }

  let width = cellCount * columnWidth + lastCellRight - startCellLeft;
  if (width < MIN_GANTT_TASK_WIDTH) width = MIN_GANTT_TASK_WIDTH;

  const left = startCell * columnWidth + startCellLeft - GANTT_LEFT_SHIFT;

  let actualWidth = 0;
  if (actual) {
    actualWidth = actualCellCount * columnWidth + actualLastCellRight - actualStartCellLeft;
    if (actualWidth < MIN_GANTT_TASK_WIDTH) actualWidth = MIN_GANTT_TASK_WIDTH;
  }
  let actualLeft = 0;
  if (actual) {
    actualLeft = actualStartCell * columnWidth + actualStartCellLeft - GANTT_LEFT_SHIFT;
  }

  return {
    index: opts.index,
    left,
    textWidth,
    width,
    actualLeft,
    actualWidth,
  };
}
