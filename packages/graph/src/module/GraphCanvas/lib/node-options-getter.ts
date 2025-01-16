import * as d3 from "d3";
import type { NodeInterface } from "@/types";
import { NODE_SETTINGS } from "../constants";
import type { GraphCanvasNodeOptions } from "../types";

const color = d3.scaleOrdinal(d3.schemeCategory10);

export function nodeOptionsGetter<NodeData extends Record<string, unknown>>(
  node: NodeInterface<NodeData>,
  _: number,
  __: NodeInterface<NodeData>[],
  transform: d3.ZoomTransform,
): Required<GraphCanvasNodeOptions> {
  return {
    ...NODE_SETTINGS,
    colorInner: color(String(node.group || "_DEFAULT")),
    text:
      node.index != undefined && transform.k > NODE_SETTINGS.zoomTextBorder
        ? String(node.index)
        : null,
  };
}
