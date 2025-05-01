import type { ZoomTransform } from "d3-zoom";
import { COMMON_SETTINGS } from "../../constants";
import type { NodeInterface } from "../../types";

type IsNodeVisibleOptions<NodeData extends Record<string, unknown>> = {
  width: number;
  height: number;
  transform: ZoomTransform;
  node: NodeInterface<NodeData>;
};

const ADDITIONAL_VIEWPORT = 10;

export function isNodeVisible<NodeData extends Record<string, unknown>>(
  opts: IsNodeVisibleOptions<NodeData>,
) {
  const left = -opts.transform.x / opts.transform.k;
  const right = (opts.width - opts.transform.x) / opts.transform.k;
  const top = -opts.transform.y / opts.transform.k;
  const bottom = (opts.height - opts.transform.y) / opts.transform.k;

  if (opts.node.x == undefined || opts.node.y == undefined) return false;

  switch (opts.node._shape) {
    case "circle": {
      const radius = opts.node._radius ?? COMMON_SETTINGS.nodeRadius;

      return (
        left < opts.node.x + radius + ADDITIONAL_VIEWPORT &&
        opts.node.x - radius - ADDITIONAL_VIEWPORT < right &&
        top < opts.node.y + radius + ADDITIONAL_VIEWPORT &&
        opts.node.y - radius - ADDITIONAL_VIEWPORT < bottom
      );
    }
    case "square":
    case "text": {
      const width = opts.node._width ?? COMMON_SETTINGS.nodeSize;
      const height = opts.node._height ?? COMMON_SETTINGS.nodeSize;

      return (
        left < opts.node.x + width + ADDITIONAL_VIEWPORT &&
        opts.node.x - width - ADDITIONAL_VIEWPORT < right &&
        top < opts.node.y + height + ADDITIONAL_VIEWPORT &&
        opts.node.y - height - ADDITIONAL_VIEWPORT < bottom
      );
    }
    default: {
      const radius = opts.node._radius ?? COMMON_SETTINGS.nodeRadius;

      return (
        left < opts.node.x + radius + ADDITIONAL_VIEWPORT &&
        opts.node.x - radius - ADDITIONAL_VIEWPORT < right &&
        top < opts.node.y + radius + ADDITIONAL_VIEWPORT &&
        opts.node.y - radius - ADDITIONAL_VIEWPORT < bottom
      );
    }
  }
}
