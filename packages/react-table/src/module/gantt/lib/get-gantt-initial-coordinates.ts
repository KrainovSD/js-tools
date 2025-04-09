import { GANTT_ROW_HEIGHT, GANTT_ROW_HEIGHT_MINI } from "../../../table.constants";
import type { GanttInfo, GanttViewType } from "../../../types";
import { GANTT_LEFT_SHIFT } from "../gantt.constants";
import type { HeaderItem } from "../hooks";
import { getGanttColumnWidth } from "./get-gantt-column-width";
import { getMonthDifference } from "./get-month-difference";

const MIN_ITEM_WIDTH = 10;

type GetGanttInitialCoordinates = {
  ganttView?: GanttViewType;
  ganttInfo: GanttInfo;
  ganttRowMini?: boolean;
  index: number;
  headerItems: HeaderItem[];
};

export function getGanttInitialCoordinates(opts: GetGanttInitialCoordinates): {
  width: number;
  left: number;
  top: number;
  textWidth: number;
  height: number;
} {
  const GANTT_COLUMN_WIDTH = getGanttColumnWidth(opts.ganttView);
  const ROW_HEIGHT = opts.ganttRowMini ? GANTT_ROW_HEIGHT_MINI : GANTT_ROW_HEIGHT;

  const textWidth = opts.ganttInfo.name.length * 6 + 20;
  const top = opts.index * ROW_HEIGHT + ROW_HEIGHT / 2;
  let height = ROW_HEIGHT / 2;
  if (opts.ganttInfo.type === "milestone") {
    height /= 1.5;
  }

  let width = 0;
  let left = 0;

  switch (opts.ganttView) {
    case "months": {
      const startDate = new Date(opts.ganttInfo.start);
      const endDate = new Date(opts.ganttInfo.end);
      const monthWidth = getMonthDifference(startDate, endDate) * GANTT_COLUMN_WIDTH;
      const startWidth = (GANTT_COLUMN_WIDTH / 31) * startDate.getDate();
      const endWidth = (GANTT_COLUMN_WIDTH / 31) * endDate.getDate();

      width = monthWidth + endWidth - startWidth;
      if (width < MIN_ITEM_WIDTH) width = MIN_ITEM_WIDTH;
      if (opts.ganttInfo.type === "milestone") {
        width = height;
      }

      let startCell;
      {
        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth();
        if (opts.headerItems[0].year < startYear) {
          startCell = opts.headerItems[0].months.length;
          const diff = startYear - opts.headerItems[0].year - 1;
          for (let i = 0; i < diff; i++) {
            startCell += 12;
          }
          startCell += startMonth;
        } else {
          startCell = startMonth - opts.headerItems[0].months[0];
        }
      }

      left = startCell * GANTT_COLUMN_WIDTH + startWidth - GANTT_LEFT_SHIFT;

      break;
    }
    default: {
      break;
    }
  }

  return {
    width,
    left,
    height,
    textWidth,
    top,
  };
}
