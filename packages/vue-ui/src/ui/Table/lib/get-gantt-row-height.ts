import { GANTT_ROW_LG_HEIGHT, GANTT_ROW_SM_HEIGHT } from "../constants";
import type { GanttSize } from "../types";

export function getGanttRowHeight(ganttSize: GanttSize) {
  switch (ganttSize) {
    case "lg": {
      return GANTT_ROW_LG_HEIGHT;
    }
    case "sm": {
      return GANTT_ROW_SM_HEIGHT;
    }
    default: {
      return GANTT_ROW_SM_HEIGHT;
    }
  }
}
