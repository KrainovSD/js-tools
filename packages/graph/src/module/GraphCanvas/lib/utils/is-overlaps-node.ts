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
    case "square":
    case "text": {
      const width = node._width ?? 5;
      const height = node._height ?? 5;
      const borderRadius = node._borderRadius ?? 0;
      const overlaps =
        Math.abs(pointerX - node.x) <= width / 2 && Math.abs(pointerY - node.y) <= height / 2;

      if (node._shape !== "text" && borderRadius != undefined && borderRadius > 0 && overlaps) {
        return isCursorOverRoundedRect(
          pointerX,
          pointerY,
          node.x,
          node.y,
          width / 2,
          height / 2,
          borderRadius,
        );
      }

      return overlaps;
    }
    default: {
      const nodeRadius = node._radius ?? radius ?? 5;
      const isOverX = node.x - nodeRadius <= pointerX && pointerX <= node.x + nodeRadius;
      const isOverY = node.y - nodeRadius <= pointerY && pointerY <= node.y + nodeRadius;

      return isOverX && isOverY;
    }
  }
}

function isCursorOverRoundedRect(
  pointerX: number,
  pointerY: number,
  x: number,
  y: number,
  halfWidth: number,
  halfHeight: number,
  borderRadius: number,
) {
  const left = x - halfWidth;
  const right = x + halfWidth;
  const top = y - halfHeight;
  const bottom = y + halfHeight;

  if (pointerX < left + borderRadius && pointerY < top + borderRadius) {
    const dx = pointerX - (left + borderRadius);
    const dy = pointerY - (top + borderRadius);

    return dx * dx + dy * dy <= borderRadius * borderRadius;
  } else if (pointerX > right - borderRadius && pointerY < top + borderRadius) {
    const dx = pointerX - (right - borderRadius);
    const dy = pointerY - (top + borderRadius);

    return dx * dx + dy * dy <= borderRadius * borderRadius;
  } else if (pointerX < left + borderRadius && pointerY > bottom - borderRadius) {
    const dx = pointerX - (left + borderRadius);
    const dy = pointerY - (bottom - borderRadius);

    return dx * dx + dy * dy <= borderRadius * borderRadius;
  } else if (pointerX > right - borderRadius && pointerY > bottom - borderRadius) {
    const dx = pointerX - (right - borderRadius);
    const dy = pointerY - (bottom - borderRadius);

    return dx * dx + dy * dy <= borderRadius * borderRadius;
  }

  return true;
}
