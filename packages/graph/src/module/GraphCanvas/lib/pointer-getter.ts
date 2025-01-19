import type { ZoomTransform } from "d3";

export function pointerGetter(
  mouseEvent: MouseEvent,
  areaRect: DOMRect,
  areaTransform: ZoomTransform,
) {
  const px = (mouseEvent.clientX - areaRect.left - areaTransform.x) / areaTransform.k;
  const py = (mouseEvent.clientY - areaRect.top - areaTransform.y) / areaTransform.k;

  return [px, py];
}
