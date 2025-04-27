import { greatest } from "d3-array";
import type { ZoomTransform } from "d3-zoom";
import type { NodeInterface } from "@/types";
import { isOverlapsNode } from "./is-overlaps-node";
import { pointerGetter } from "./pointer-getter";

export type NodeByPointerGetterOptions<NodeData extends Record<string, unknown>> = {
  mouseEvent: MouseEvent | TouchEvent;
  areaRect: DOMRect | undefined;
  areaTransform: ZoomTransform;
  nodes: NodeInterface<NodeData>[];
};

export function nodeByPointerGetter<NodeData extends Record<string, unknown>>({
  areaRect,
  areaTransform,
  mouseEvent,
  nodes,
}: NodeByPointerGetterOptions<NodeData>): NodeInterface<NodeData> | undefined {
  if (!areaRect) return undefined;

  const [pointerX, pointerY] = pointerGetter(mouseEvent, areaRect, areaTransform);

  return greatest(nodes, (node) => {
    if (isOverlapsNode(node, pointerX, pointerY, undefined)) return node.index;
  });
}
