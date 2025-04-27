import type { LinkInterface, NodeInterface } from "@/types";
import { COMMON_SETTINGS } from "../../constants";

type Point = {
  x: number;
  y: number;
};

export function calculateLinkPositionByNode<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(link: LinkInterface<NodeData, LinkData>, arrowSize = 0) {
  const source = link.source;
  const target = link.target;

  if (typeof source != "object" || typeof target != "object") return null;

  const sourcePoint = getLinkPoint({
    arrowSize: 0,
    node: source,
    oppositeNode: target,
  });
  const targetPoint = getLinkPoint({
    arrowSize: arrowSize > 0 ? arrowSize * 0.85 : 0,
    node: target,
    oppositeNode: source,
  });

  if (!sourcePoint || !targetPoint) return null;

  const distance =
    targetPoint && sourcePoint
      ? Math.sqrt((targetPoint.x - sourcePoint.x) ** 2 + (targetPoint.y - sourcePoint.y) ** 2)
      : 0;

  return {
    x1: sourcePoint.x,
    y1: sourcePoint.y,
    x2: targetPoint.x,
    y2: targetPoint.y,
    distance,
  };
}

type GetLinkPointProps<NodeData extends Record<string, unknown>> = {
  arrowSize: number;
  node: NodeInterface<NodeData>;
  oppositeNode: NodeInterface<NodeData>;
};
function getLinkPoint<NodeData extends Record<string, unknown>>(opts: GetLinkPointProps<NodeData>) {
  if (
    opts.node.x == undefined ||
    opts.node.y == undefined ||
    opts.oppositeNode.x == undefined ||
    opts.oppositeNode.y == undefined
  )
    return null;

  let nodePoint: Point;
  switch (opts.node._shape) {
    case "circle": {
      nodePoint = getCircleIntersection({
        x: opts.node.x,
        y: opts.node.y,
        radius: opts.node._radius ?? COMMON_SETTINGS.nodeRadius,
        oppositeX: opts.oppositeNode.x,
        oppositeY: opts.oppositeNode.y,
        arrowSize: opts.arrowSize,
      });
      break;
    }
    case "square": {
      nodePoint = getRectangleIntersection({
        arrowSize: opts.arrowSize,
        x: opts.node.x,
        y: opts.node.y,
        height: opts.node._height ?? COMMON_SETTINGS.nodeSize,
        width: opts.node._width ?? COMMON_SETTINGS.nodeSize,
        oppositeX: opts.oppositeNode.x,
        oppositeY: opts.oppositeNode.y,
      });
      break;
    }
    default: {
      nodePoint = getCircleIntersection({
        x: opts.node.x,
        y: opts.node.y,
        radius: opts.node._radius ?? COMMON_SETTINGS.nodeRadius,
        oppositeX: opts.oppositeNode.x,
        oppositeY: opts.oppositeNode.y,
        arrowSize: opts.arrowSize,
      });
    }
  }

  return nodePoint;
}

type GetCircleIntersection = {
  x: number;
  y: number;
  radius: number;
  oppositeX: number;
  oppositeY: number;
  arrowSize: number;
};

function getCircleIntersection(opts: GetCircleIntersection): Point {
  const dx = opts.oppositeX - opts.x;
  const dy = opts.oppositeY - opts.y;
  const dr = Math.sqrt(dx * dx + dy * dy);

  const radius = opts.radius + opts.arrowSize;

  return {
    x: opts.x + (dx * radius) / dr,
    y: opts.y + (dy * radius) / dr,
  };
}

type GetRectangleIntersection = {
  x: number;
  y: number;
  width: number;
  height: number;
  oppositeX: number;
  oppositeY: number;
  arrowSize: number;
};
function getRectangleIntersection(opts: GetRectangleIntersection): Point {
  const halfWidth = opts.width / 2;
  const halfHeight = opts.height / 2;

  const dx = opts.oppositeX - opts.x;
  const dy = opts.oppositeY - opts.y;

  if (Math.abs(dx) <= halfWidth && Math.abs(dy) <= halfHeight) {
    const distToRight = halfWidth - dx;
    const distToLeft = halfWidth + dx;
    const distToTop = halfHeight - dy;
    const distToBottom = halfHeight + dy;

    const minDist = Math.min(distToRight, distToLeft, distToTop, distToBottom);

    const x =
      opts.x + (minDist === distToRight ? halfWidth : minDist === distToLeft ? -halfWidth : dx);
    const y =
      opts.y + (minDist === distToTop ? halfHeight : minDist === distToBottom ? -halfHeight : dy);

    return { x, y };
  }

  let x, y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (halfWidth * absDy < halfHeight * absDx) {
    x = dx > 0 ? halfWidth : -halfWidth;
    y = (x * dy) / dx;
    if (Math.abs(y) > halfHeight) {
      y = dy > 0 ? halfHeight : -halfHeight;
      x = (y * dx) / dy;
    }
  } else {
    y = dy > 0 ? halfHeight : -halfHeight;
    x = (y * dx) / dy;
    if (Math.abs(x) > halfWidth) {
      x = dx > 0 ? halfWidth : -halfWidth;
      y = (x * dy) / dx;
    }
  }

  if (opts.arrowSize > 0) {
    const edgeDist = Math.sqrt(x * x + y * y);
    const scale = (edgeDist + opts.arrowSize) / edgeDist;
    x *= scale;
    y *= scale;
  }

  return {
    x: opts.x + x,
    y: opts.y + y,
  };
}
