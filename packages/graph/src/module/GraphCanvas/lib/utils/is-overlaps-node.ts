import type { NodeInterface } from "@/types";

export function isOverlapsNode<NodeData extends Record<string, unknown>>(
  node: NodeInterface<NodeData>,
  pointerX: number,
  pointerY: number,
  radius: number | undefined,
) {
  if (node.x == undefined || node.y == undefined) return false;

  switch (node._shape) {
    case "circle": {
      const nodeRadius = node._radius ?? radius ?? 5;
      const isOverX = node.x - nodeRadius <= pointerX && pointerX <= node.x + nodeRadius;
      const isOverY = node.y - nodeRadius <= pointerY && pointerY <= node.y + nodeRadius;

      return isOverX && isOverY;
    }
    case "square": {
      const width = node._width ?? 5;
      const height = node._height ?? 5;

      return Math.abs(pointerX - node.x) <= width / 2 && Math.abs(pointerY - node.y) <= height / 2;
    }
    default: {
      const nodeRadius = node._radius ?? radius ?? 5;
      const isOverX = node.x - nodeRadius <= pointerX && pointerX <= node.x + nodeRadius;
      const isOverY = node.y - nodeRadius <= pointerY && pointerY <= node.y + nodeRadius;

      return isOverX && isOverY;
    }
  }
}
