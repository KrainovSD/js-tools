import * as d3 from "d3";
import type { NodeInterface } from "@/types";

const color = d3.scaleOrdinal(d3.schemeCategory10);

export function nodeColorGetter<NodeData extends Record<string, unknown>>(
  node: NodeInterface<NodeData>,
) {
  return color(String(node.group));
}
