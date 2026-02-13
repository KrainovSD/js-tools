import { COMMON_SETTINGS } from "../../constants";
import type { NodeInterface } from "../../types";

type Point = {
  x: number;
  y: number;
};

export function calculateLinkPositionByNode<NodeData extends Record<string, unknown>>(
  xStart: number,
  yStart: number,
  xEnd: number,
  yEnd: number,
  sourceNode: NodeInterface<NodeData>,
  targetNode: NodeInterface<NodeData>,
  arrowSize = 0,
) {
  const sourcePoint = getLinkPoint({
    xStart,
    yStart,
    xEnd,
    yEnd,
    arrowSize: 0,
    node: sourceNode,
    oppositeNode: targetNode,
  });
  const targetPoint = getLinkPoint({
    xStart: xEnd,
    yStart: yEnd,
    xEnd: xStart,
    yEnd: yStart,
    arrowSize: arrowSize > 0 ? arrowSize * 0.9 : 0,
    node: targetNode,
    oppositeNode: sourceNode,
  });
  const targetPointArrow = getLinkPoint({
    xStart: xEnd,
    yStart: yEnd,
    xEnd: xStart,
    yEnd: yStart,
    arrowSize: 0,
    node: targetNode,
    oppositeNode: sourceNode,
  });

  const distance =
    targetPoint && sourcePoint
      ? Math.sqrt((targetPoint.x - sourcePoint.x) ** 2 + (targetPoint.y - sourcePoint.y) ** 2)
      : 0;

  return {
    xStart: sourcePoint.x,
    yStart: sourcePoint.y,
    xEnd: targetPoint.x,
    yEnd: targetPoint.y,
    xEndArrow: targetPointArrow.x,
    yEndArrow: targetPointArrow.y,
    distance,
  };
}

type GetLinkPointProps<NodeData extends Record<string, unknown>> = {
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  arrowSize: number;
  node: NodeInterface<NodeData>;
  oppositeNode: NodeInterface<NodeData>;
};
function getLinkPoint<NodeData extends Record<string, unknown>>(opts: GetLinkPointProps<NodeData>) {
  let nodePoint: Point;
  switch (opts.node._shape) {
    case "circle": {
      nodePoint = getCircleIntersection({
        x: opts.xStart,
        y: opts.yStart,
        radius:
          (opts.node._radius ?? COMMON_SETTINGS.nodeRadius) +
          (opts.node._borderWidth ? opts.node._borderWidth / 2 : 0),
        oppositeX: opts.xEnd,
        oppositeY: opts.yEnd,
        arrowSize: opts.arrowSize,
      });
      break;
    }
    case "square":
    case "text": {
      nodePoint = getRectangleIntersection({
        arrowSize: opts.arrowSize,
        x: opts.xStart,
        y: opts.yStart,
        height: (opts.node._height ?? COMMON_SETTINGS.nodeSize) + (opts.node._borderWidth ?? 0),
        width: (opts.node._width ?? COMMON_SETTINGS.nodeSize) + (opts.node._borderWidth ?? 0),
        oppositeX: opts.xEnd,
        oppositeY: opts.yEnd,
        borderRadius: opts.node._shape === "text" ? 0 : (opts.node._borderRadius ?? 0),
      });
      break;
    }
    default: {
      nodePoint = getCircleIntersection({
        x: opts.xStart,
        y: opts.yStart,
        radius: opts.node._radius ?? COMMON_SETTINGS.nodeRadius,
        oppositeX: opts.xEnd,
        oppositeY: opts.yEnd,
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
  borderRadius: number;
};

function getRectangleIntersection(opts: GetRectangleIntersection): Point {
  const halfWidth = opts.width / 2;
  const halfHeight = opts.height / 2;

  const dx = opts.oppositeX - opts.x;
  const dy = opts.oppositeY - opts.y;

  let relX: number, relY: number;

  if (Math.abs(dx) <= halfWidth && Math.abs(dy) <= halfHeight) {
    const distToRight = halfWidth - dx;
    const distToLeft = halfWidth + dx;
    const distToTop = halfHeight - dy;
    const distToBottom = halfHeight + dy;

    const minDist = Math.min(distToRight, distToLeft, distToTop, distToBottom);

    relX = minDist === distToRight ? halfWidth : minDist === distToLeft ? -halfWidth : dx;
    relY = minDist === distToTop ? halfHeight : minDist === distToBottom ? -halfHeight : dy;
  } else {
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (halfWidth * absDy < halfHeight * absDx) {
      relX = dx > 0 ? halfWidth : -halfWidth;
      relY = (relX * dy) / dx;
      if (Math.abs(relY) > halfHeight) {
        relY = dy > 0 ? halfHeight : -halfHeight;
        relX = (relY * dx) / dy;
      }
    } else {
      relY = dy > 0 ? halfHeight : -halfHeight;
      relX = (relY * dx) / dy;
      if (Math.abs(relX) > halfWidth) {
        relX = dx > 0 ? halfWidth : -halfWidth;
        relY = (relX * dy) / dx;
      }
    }
  }

  if (opts.borderRadius != undefined) {
    const { x, y } = squareRadiusFix(relX, relY, halfWidth, halfHeight, opts.borderRadius);
    if (x != undefined) relX = x;
    if (y != undefined) relY = y;
  }

  if (opts.arrowSize > 0) {
    const edgeDist = Math.sqrt(relX * relX + relY * relY);
    const scale = (edgeDist + opts.arrowSize) / edgeDist;
    relX *= scale;
    relY *= scale;
  }

  return {
    x: opts.x + relX,
    y: opts.y + relY,
  };
}

// eslint-disable-next-line no-warning-comments
// TODO: Need upgrade
function squareRadiusFix(
  relX: number,
  relY: number,
  halfWidth: number,
  halfHeight: number,
  borderRadius: number,
) {
  const epsilon = 1e-6;
  const absX = Math.abs(relX);
  const absY = Math.abs(relY);

  let side: string | null = null;
  if (absX >= halfWidth - epsilon) {
    side = relX > 0 ? "right" : "left";
  } else if (absY >= halfHeight - epsilon) {
    side = relY > 0 ? "top" : "bottom";
  }

  if (side) {
    const topBound = halfHeight - borderRadius;
    const bottomBound = -topBound;
    const rightBound = halfWidth - borderRadius;
    const leftBound = -rightBound;

    switch (side) {
      case "right":
        if (relY > topBound) {
          return checkIntersection(relX, relY, halfWidth, halfHeight, borderRadius, "right-top");
        } else if (relY < bottomBound) {
          return checkIntersection(relX, relY, halfWidth, halfHeight, borderRadius, "right-bottom");
        }
        break;
      case "left":
        if (relY > topBound) {
          return checkIntersection(relX, relY, halfWidth, halfHeight, borderRadius, "left-top");
        } else if (relY < bottomBound) {
          return checkIntersection(relX, relY, halfWidth, halfHeight, borderRadius, "left-bottom");
        }
        break;
      case "top":
        if (relX > rightBound) {
          return checkIntersection(relX, relY, halfWidth, halfHeight, borderRadius, "top-right");
        } else if (relX < leftBound) {
          return checkIntersection(relX, relY, halfWidth, halfHeight, borderRadius, "top-left");
        }
        break;
      case "bottom":
        if (relX > rightBound) {
          return checkIntersection(relX, relY, halfWidth, halfHeight, borderRadius, "bottom-right");
        } else if (relX < leftBound) {
          return checkIntersection(relX, relY, halfWidth, halfHeight, borderRadius, "bottom-left");
        }
        break;
      default:
        break;
    }
  }

  return { x: undefined, y: undefined };
}

function checkIntersection(
  relX: number,
  relY: number,
  halfWidth: number,
  halfHeight: number,
  r: number,
  corner: Parameters<typeof intersectWithCircle>[5],
) {
  const intersect = intersectWithCircle(relX, relY, halfWidth, halfHeight, r, corner);

  return intersect ?? { x: undefined, y: undefined };
}

function intersectWithCircle(
  relX: number,
  relY: number,
  halfWidth: number,
  halfHeight: number,
  r: number,
  corner:
    | "right-top"
    | "right-bottom"
    | "left-top"
    | "left-bottom"
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left",
) {
  switch (corner) {
    case "top-right":
      corner = "right-top";
      break;
    case "bottom-right":
      corner = "right-bottom";
      break;
    case "top-left":
      corner = "left-top";
      break;
    case "bottom-left":
      corner = "left-bottom";
      break;
    default:
      break;
  }

  let cx: number, cy: number;
  switch (corner) {
    case "right-top":
      cx = halfWidth - r;
      cy = halfHeight - r;
      break;
    case "right-bottom":
      cx = halfWidth - r;
      cy = -halfHeight + r;
      break;
    case "left-top":
      cx = -halfWidth + r;
      cy = halfHeight - r;
      break;
    case "left-bottom":
      cx = -halfWidth + r;
      cy = -halfHeight + r;
      break;
    default:
      return null;
  }

  const a = relX ** 2 + relY ** 2;
  if (a === 0) return null;

  const b = -2 * (relX * cx + relY * cy);
  const c = cx ** 2 + cy ** 2 - r ** 2;
  const discriminant = b ** 2 - 4 * a * c;

  if (discriminant < 0) return null;
  const sqrtD = Math.sqrt(discriminant);

  const t2 = (-b - sqrtD) / (2 * a);
  const t1 = (-b + sqrtD) / (2 * a);
  const t = t2 > 0 ? t2 : t1 > 0 ? t1 : null;

  if (t === null || t >= 1) return null;

  const x = t * relX;
  const y = t * relY;

  let valid = false;
  switch (corner) {
    case "right-top":
      valid = x >= cx && y >= cy;
      break;
    case "right-bottom":
      valid = x >= cx && y <= cy;
      break;
    case "left-top":
      valid = x <= cx && y >= cy;
      break;
    case "left-bottom":
      valid = x <= cx && y <= cy;
      break;
    default:
      break;
  }

  return valid ? { x, y } : null;
}
