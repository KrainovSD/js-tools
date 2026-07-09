import { greatest } from "d3-array";
import type { NodeInterface } from "../../types";
import { isOverlapsNode } from "./is-overlaps-node";

export type NodeByPointerGetterOptions<NodeData extends Record<string, unknown>> = {
  pointerX: number;
  pointerY: number;
  nodes: NodeInterface<NodeData>[];
};

export function nodeByPointerGetter<NodeData extends Record<string, unknown>>({
  pointerX,
  pointerY,
  nodes,
}: NodeByPointerGetterOptions<NodeData>): NodeInterface<NodeData> | undefined {
  return greatest(nodes, (node) => {
    if (isOverlapsNode(node, pointerX, pointerY, undefined)) {
      return node.index;
    }
  });
}
