import * as d3 from "d3";
import type { NodeInterface } from "@/types";
import type { GraphCanvasNodeOptions } from "../GraphCanvas.types";

const color = d3.scaleOrdinal(d3.schemeCategory10);

export function nodeOptionsGetter<NodeData extends Record<string, unknown>>(
  node: NodeInterface<NodeData>,
): Required<GraphCanvasNodeOptions> {
  return {
    alpha: 1,
    colorOuter: "#fff",
    colorInner: color(String(node.group)),
    font: "8px Arial",
    fontAlign: "center",
    fontColor: "#333",
    radius: 5,
    text: node.index != undefined ? String(node.index) : null,
    width: 1,
  };
}
