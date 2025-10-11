import { GANTT_LINK_TOP_SHIFT_LG, GANTT_LINK_TOP_SHIFT_SM } from "../constants";
import type { GanttSize } from "../types";

export function getGanttLinkTopShift(size: GanttSize) {
  switch (size) {
    case "sm": {
      return GANTT_LINK_TOP_SHIFT_SM;
    }
    case "lg": {
      return GANTT_LINK_TOP_SHIFT_LG;
    }
    default: {
      return GANTT_LINK_TOP_SHIFT_SM;
    }
  }
}
