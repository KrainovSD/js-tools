import type { NodeInterface } from "../../types";
import { isOverlapsNode } from "./is-overlaps-node";

export function dragPlaceCoefficientGetter<NodeData extends Record<string, unknown>>(
  node: NodeInterface<NodeData>,
  pointerX: number,
  pointerY: number,
): number | undefined {
  if (!node.x || !node.y) return undefined;

  if (isOverlapsNode(node, pointerX, pointerY, undefined)) return node.index;
}
