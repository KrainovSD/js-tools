import { COMMON_SETTINGS } from "../../constants";
import type { Area, NodeInterface } from "../../types";

const ADDITIONAL_VIEWPORT = 10;

export function isNodeVisible<NodeData extends Record<string, unknown>>(
  node: NodeInterface<NodeData>,
  area: Area,
) {
  if (node.x == undefined || node.y == undefined) return false;

  switch (node._shape) {
    case "circle": {
      const radius = node._radius ?? COMMON_SETTINGS.nodeRadius;

      return (
        area.left < node.x + radius + ADDITIONAL_VIEWPORT &&
        node.x - radius - ADDITIONAL_VIEWPORT < area.right &&
        area.top < node.y + radius + ADDITIONAL_VIEWPORT &&
        node.y - radius - ADDITIONAL_VIEWPORT < area.bottom
      );
    }
    case "square":
    case "text": {
      const width = node._width ?? COMMON_SETTINGS.nodeSize;
      const height = node._height ?? COMMON_SETTINGS.nodeSize;

      return (
        area.left < node.x + width + ADDITIONAL_VIEWPORT &&
        node.x - width - ADDITIONAL_VIEWPORT < area.right &&
        area.top < node.y + height + ADDITIONAL_VIEWPORT &&
        node.y - height - ADDITIONAL_VIEWPORT < area.bottom
      );
    }
    default: {
      const radius = node._radius ?? COMMON_SETTINGS.nodeRadius;

      return (
        area.left < node.x + radius + ADDITIONAL_VIEWPORT &&
        node.x - radius - ADDITIONAL_VIEWPORT < area.right &&
        area.top < node.y + radius + ADDITIONAL_VIEWPORT &&
        node.y - radius - ADDITIONAL_VIEWPORT < area.bottom
      );
    }
  }
}
