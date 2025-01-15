import * as d3 from "d3";
import type { NodeInterface } from "@/types";
import { NODE_SETTINGS } from "../constants";
import type { GraphCanvasNodeOptions } from "../types";

const color = d3.scaleOrdinal(d3.schemeCategory10);

export function nodeOptionsGetter<NodeData extends Record<string, unknown>>(
  node: NodeInterface<NodeData>,
): Required<GraphCanvasNodeOptions> {
  return {
    ...NODE_SETTINGS,
    colorInner: color(String(node.group)),
    text: node.index != undefined ? String(node.index) : null,
  };
}
