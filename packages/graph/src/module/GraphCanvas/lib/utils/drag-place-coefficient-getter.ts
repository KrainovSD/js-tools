import type { NodeInterface } from "@/types";
import { isOverlapsNode } from "./is-overlaps-node";

export function dragPlaceCoefficientGetter<NodeData extends Record<string, unknown>>(
  node: NodeInterface<NodeData>,
  pointerX: number,
  pointerY: number,
  radius: number,
): number | undefined {
  if (!node.x || !node.y) return undefined;

  if (isOverlapsNode(node, radius, pointerX, pointerY))
    return (node.x - pointerX) ** 2 + (node.y - pointerY) ** 2;

  return undefined;
}
