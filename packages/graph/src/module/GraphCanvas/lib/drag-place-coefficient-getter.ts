import type { NodeInterface } from "@/types";

export function dragPlaceCoefficientGetter<NodeData extends Record<string, unknown>>(
  node: NodeInterface<NodeData>,
  pxEvent: number,
  pyEvent: number,
): number | undefined {
  if (!node.x || !node.y) return undefined;

  return (node.x - pxEvent) ** 2 + (node.y - pyEvent) ** 2;
}
