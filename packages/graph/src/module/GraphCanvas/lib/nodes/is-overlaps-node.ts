import type { NodeInterface } from "@/types";

export function isOverlapsNode<NodeData extends Record<string, unknown>>(
  node: NodeInterface<NodeData>,
  radius: number,
  pointerX: number,
  pointerY: number,
) {
  if (node.x == undefined || node.y == undefined) return false;

  const isOverX = node.x - radius <= pointerX && pointerX <= node.x + radius;
  const isOverY = node.y - radius <= pointerY && pointerY <= node.y + radius;

  return isOverX && isOverY;
}
