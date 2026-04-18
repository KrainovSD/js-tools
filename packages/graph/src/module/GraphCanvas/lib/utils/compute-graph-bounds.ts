import type { NodeInterface } from "../../types";

export interface GraphBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function computeGraphBounds<NodeData extends Record<string, unknown>>(
  nodes: NodeInterface<NodeData>[],
): GraphBounds | null {
  if (!nodes.length) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const node of nodes) {
    if (node.x === null || node.x === undefined || node.y === null || node.y === undefined)
      continue;
    if (node.visible === false) continue;

    let radius = node._radius;
    radius ??= Math.max(node._width ?? 0, node._height ?? 0) / 2;
    minX = Math.min(minX, node.x - radius);
    minY = Math.min(minY, node.y - radius);
    maxX = Math.max(maxX, node.x + radius);
    maxY = Math.max(maxY, node.y + radius);
  }

  if (!isFinite(minX)) return null;

  return { minX, minY, maxX, maxY };
}
