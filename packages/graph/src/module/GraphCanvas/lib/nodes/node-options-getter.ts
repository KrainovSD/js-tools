import type { ZoomTransform } from "d3-zoom";
import { colorGetter } from "@/lib";
import type { NodeInterface } from "@/types";
import { NODE_SETTINGS } from "../../constants";
import type { GraphCanvasNodeOptions } from "../../types";

const color = colorGetter();

export function nodeOptionsGetter<NodeData extends Record<string, unknown>>(
  node: NodeInterface<NodeData>,
  _: number,
  __: NodeInterface<NodeData>[],
  transform?: ZoomTransform,
): Required<GraphCanvasNodeOptions> {
  return {
    ...NODE_SETTINGS,
    colorInner: color(String(node.group || "_DEFAULT")),
    text:
      transform && node.id != undefined && transform.k > NODE_SETTINGS.zoomTextBorder
        ? String(node.id)
        : null,
  };
}
