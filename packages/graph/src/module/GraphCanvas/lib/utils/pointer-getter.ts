import type { ZoomTransform } from "d3-zoom";

export function pointerGetter(
  mouseEvent: MouseEvent | TouchEvent,
  areaRect: DOMRect,
  areaTransform: ZoomTransform,
) {
  const clientX =
    "clientX" in mouseEvent
      ? mouseEvent.clientX
      : (mouseEvent.touches[0]?.clientX ?? mouseEvent.changedTouches[0]?.clientX);
  const clientY =
    "clientX" in mouseEvent
      ? mouseEvent.clientY
      : (mouseEvent.touches[0]?.clientY ?? mouseEvent.changedTouches[0]?.clientY);

  const px = (clientX - areaRect.left - areaTransform.x) / areaTransform.k;
  const py = (clientY - areaRect.top - areaTransform.y) / areaTransform.k;

  return [px, py];
}
