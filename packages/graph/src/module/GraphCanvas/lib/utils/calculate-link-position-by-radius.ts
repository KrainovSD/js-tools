import type { LinkInterface } from "@/types";

export function calculateLinkPositionByRadius<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(link: LinkInterface<NodeData, LinkData>, arrowSize = 0) {
  const source = link.source;
  const target = link.target;

  if (typeof source != "object" || typeof target != "object") return null;

  const dx = (target.x ?? 0) - (source.x ?? 0);
  const dy = (target.y ?? 0) - (source.y ?? 0);
  const dr = Math.sqrt(dx * dx + dy * dy);
  const sourceRadius = source._radius ?? 0;
  const targetRadius = (target._radius ?? 0) + (arrowSize > 0 ? arrowSize - 0.2 : 0);

  return {
    x1: (source.x ?? 0) + (dx * sourceRadius) / dr,
    y1: (source.y ?? 0) + (dy * sourceRadius) / dr,
    x2: (target.x ?? 0) - (dx * targetRadius) / dr,
    y2: (target.y ?? 0) - (dy * targetRadius) / dr,
  };
}
