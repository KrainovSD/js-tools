import {
  GANTT_COLUMN_WIDTH_MONTH,
  GANTT_COLUMN_WIDTH_QUARTER,
  GANTT_COLUMN_WIDTH_WEEK,
  GANTT_COLUMN_WIDTH_YEAR,
} from "../constants";
import type { GanttViewType } from "../types";

export function getGanttColumnWidth(ganttView?: GanttViewType) {
  switch (ganttView) {
    case "months": {
      return GANTT_COLUMN_WIDTH_MONTH;
    }
    case "years": {
      return GANTT_COLUMN_WIDTH_YEAR;
    }
    case "quarters": {
      return GANTT_COLUMN_WIDTH_QUARTER;
    }
    case "weeks": {
      return GANTT_COLUMN_WIDTH_WEEK;
    }
    default: {
      return GANTT_COLUMN_WIDTH_MONTH;
    }
  }
}
