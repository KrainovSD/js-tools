import { LINK_SETTINGS } from "../constants";
import type { GraphCanvasLinkOptions } from "../types";

export function linkOptionsGetter(): Required<GraphCanvasLinkOptions> {
  return LINK_SETTINGS;
}
