import { isObject } from "@krainovsd/js-helpers";
import type { GanttLink } from "../types";

export function extractGanttLinkId(link: GanttLink) {
  return isObject(link) ? link.dependentId : link;
}
