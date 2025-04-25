/* eslint-disable id-length */
import { isObject } from "@krainovsd/js-helpers";
import { greatest } from "d3-array";
import type { ZoomTransform } from "d3-zoom";
import type { LinkInterface } from "@/types";
import type { LinkSettingsInterface } from "../../types";
import { pointerGetter } from "./pointer-getter";

export type LinkByPointerGetterOptions<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  mouseEvent: MouseEvent | TouchEvent;
  areaRect: DOMRect | undefined;
  areaTransform: ZoomTransform;
  links: LinkInterface<NodeData, LinkData>[];
  linkSettings: Required<Omit<LinkSettingsInterface<NodeData, LinkData>, "options">> &
    Pick<LinkSettingsInterface<NodeData, LinkData>, "options">;
};

export function linkByPointerGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>({
  areaRect,
  areaTransform,
  mouseEvent,
  links,
  linkSettings,
}: LinkByPointerGetterOptions<NodeData, LinkData>): LinkInterface<NodeData, LinkData> | undefined {
  if (!areaRect) return undefined;

  const [pointerX, pointerY] = pointerGetter(mouseEvent, areaRect, areaTransform);

  return greatest(links, (link) => {
    if (isNearLink(pointerX, pointerY, link, linkSettings.hoverLinkThreshold)) return link.index;
  });
}

function isNearLink<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(mouseX: number, mouseY: number, link: LinkInterface<NodeData, LinkData>, threshold = 2) {
  if (!isObject(link.source) || !isObject(link.target)) return false;

  const x1 = link.source.x as number;
  const y1 = link.source.y as number;
  const x2 = link.target.x as number;
  const y2 = link.target.y as number;

  const distance = distanceToLine(mouseX, mouseY, x1, y1, x2, y2);

  return distance <= threshold;
}

function distanceToLine(x: number, y: number, x1: number, y1: number, x2: number, y2: number) {
  const A = x - x1;
  const B = y - y1;
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

  const dx = x - xx;
  const dy = y - yy;

  return Math.sqrt(dx * dx + dy * dy);
}
