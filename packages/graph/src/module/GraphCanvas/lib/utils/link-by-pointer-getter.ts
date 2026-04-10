import { isObject } from "@krainovsd/js-helpers";
import { greatest } from "d3-array";
import type { ZoomTransform } from "d3-zoom";
import type { LinkInterface } from "../../types";
import { pointerGetter } from "./pointer-getter";

export type LinkByPointerGetterOptions<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  mouseEvent: MouseEvent | TouchEvent;
  areaRect: DOMRect | undefined;
  areaTransform: ZoomTransform;
  links: LinkInterface<NodeData, LinkData>[];
  linkHoverExtraZone: number;
  curve: boolean;
};

export function linkByPointerGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>({
  areaRect,
  areaTransform,
  mouseEvent,
  links,
  linkHoverExtraZone,
  curve,
}: LinkByPointerGetterOptions<NodeData, LinkData>): LinkInterface<NodeData, LinkData> | undefined {
  if (!areaRect) return undefined;

  const [pointerX, pointerY] = pointerGetter(mouseEvent, areaRect, areaTransform);

  return greatest(links, (link) => {
    if (
      !isObject(link.source) ||
      !isObject(link.target) ||
      link.source.visible === false ||
      link.target.visible === false
    )
      return;

    const x1 = (link._x1 ?? link.source.x) as number;
    const y1 = (link._y1 ?? link.source.y) as number;
    const x2 = (link._x2 ?? link.target.x) as number;
    const y2 = (link._y2 ?? link.target.y) as number;
    const cx = link._cx ?? 0;
    const cy = link._cy ?? 0;

    return curve
      ? hitTestQuadratic(pointerX, pointerY, x1, y1, cx, cy, x2, y2, linkHoverExtraZone)
        ? link.index
        : undefined
      : isNearLink(pointerX, pointerY, x1, y1, x2, y2, linkHoverExtraZone)
        ? link.index
        : undefined;
  });
}

function isNearLink(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  threshold = 2,
) {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;

  return Math.sqrt(dx * dx + dy * dy) <= threshold;
}

function hitTestQuadratic(
  px: number,
  py: number,
  x0: number,
  y0: number,
  xc: number,
  yc: number,
  x2: number,
  y2: number,
  tol: number,
): boolean {
  const bb = bezierBBox(x0, y0, xc, yc, x2, y2);
  if (px < bb.minX - tol || px > bb.maxX + tol || py < bb.minY - tol || py > bb.maxY + tol) {
    return false;
  }

  const chord = Math.hypot(x2 - x0, y2 - y0);
  const contLen = Math.hypot(xc - x0, yc - y0) + Math.hypot(x2 - xc, y2 - yc);
  const approxLen = (chord + contLen) / 2;
  const steps = Math.max(16, Math.ceil(approxLen / 1));

  const tol2 = tol * tol;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    const x = mt * mt * x0 + 2 * mt * t * xc + t * t * x2;
    const y = mt * mt * y0 + 2 * mt * t * yc + t * t * y2;
    const dx = px - x;
    const dy = py - y;
    if (dx * dx + dy * dy <= tol2) return true;
  }
  return false;
}

function bezierBBox(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): { minX: number; maxX: number; minY: number; maxY: number } {
  function extrema(p0: number, p1: number, p2: number): number[] {
    const denom = p0 - 2 * p1 + p2;
    if (denom === 0) return [];
    const t = (p0 - p1) / denom;
    return t > 0 && t < 1 ? [t] : [];
  }

  const ts = [...extrema(x0, x1, x2), ...extrema(y0, y1, y2), 0, 1];

  let maxX = -Infinity,
    maxY = -Infinity,
    minX = Infinity,
    minY = Infinity;

  for (const t of ts) {
    const mt = 1 - t;
    const x = mt * mt * x0 + 2 * mt * t * x1 + t * t * x2;
    const y = mt * mt * y0 + 2 * mt * t * y1 + t * t * y2;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  return { minX, minY, maxX, maxY };
}
