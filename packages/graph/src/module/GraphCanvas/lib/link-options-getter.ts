import type { GraphCanvasLinkOptions } from "../GraphCanvas.types";

export function linkOptionsGetter(): Required<GraphCanvasLinkOptions> {
  return {
    alpha: 1,
    color: "#999",
    width: 1,
  };
}
