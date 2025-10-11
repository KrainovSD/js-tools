import { GANTT_LEFT_SHIFT, MIN_GANTT_TASK_WIDTH } from "../constants";
import type { GanttRowInfo, GanttRowInfoGetterOptions } from "../types";
import { getGanttCellMonthShift } from "./get-gantt-cell-month-shift";
import { getGanttCellYearShift } from "./get-gantt-cell-year-shift";
import { getGanttColumnWidth } from "./get-gantt-column-width";
import { getGanttLinkTopShift } from "./get-gantt-link-top-shift";
import { getGanttStartCellByMonth } from "./get-gantt-start-cell-by-month";
import { getMonthDiff } from "./get-month-diff";

export function getGanttRowInfo(opts: GanttRowInfoGetterOptions): GanttRowInfo {
  const columnWidth = getGanttColumnWidth(opts.ganttView);

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
  /** Bad solution activated */
  const textWidth = opts.row.name.length * 6.5 + 20;

  const taskHeight = opts.rowHeight / 2;
  let taskWidth = cellCount * columnWidth + lastCellRight - startCellLeft;
  if (taskWidth < MIN_GANTT_TASK_WIDTH) {
    taskWidth = MIN_GANTT_TASK_WIDTH;
  }
  if (opts.row.type === "milestone") {
    taskWidth = taskHeight;
  }

  const cellLeft = startCell * columnWidth + startCellLeft - GANTT_LEFT_SHIFT;

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
    cellLeft,
    actualLeft,
    actualTop: opts.rowHeight / 2 + opts.rowHeight / 4,
    cellTop: opts.index * opts.rowHeight,
    taskTop: opts.row.type === "milestone" ? opts.rowHeight / 4 : opts.rowHeight / 2,
    textTop: textWidth <= taskWidth ? taskHeight / 2 : opts.rowHeight / 2,
    textWidth,
    taskWidth,
    actualWidth,
    cellHeight: opts.rowHeight,
    actualHeight: opts.rowHeight / 6,
    taskHeight,
    linkInputTop:
      opts.index * opts.rowHeight + opts.rowHeight / 2 + getGanttLinkTopShift(opts.ganttSize),
    linkOutputTop:
      opts.index * opts.rowHeight + opts.rowHeight / 2 + getGanttLinkTopShift(opts.ganttSize),
  };
}
