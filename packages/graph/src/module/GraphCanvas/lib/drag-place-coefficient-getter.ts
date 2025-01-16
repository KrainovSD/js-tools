import type { NodeInterface } from "@/types";

export function dragPlaceCoefficientGetter<NodeData extends Record<string, unknown>>(
  node: NodeInterface<NodeData>,
  pxEvent: number,
  pyEvent: number,
  radius: number,
): number | undefined {
  if (!node.x || !node.y) return undefined;

  const isOverX = node.x - radius <= pxEvent && pxEvent <= node.x + radius;
  const isOverY = node.y - radius <= pyEvent && pyEvent <= node.y + radius;

  if (isOverX && isOverY) return (node.x - pxEvent) ** 2 + (node.y - pyEvent) ** 2;

  return undefined;
}
