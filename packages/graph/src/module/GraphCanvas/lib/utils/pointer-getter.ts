import type { ZoomTransform } from "d3-zoom";

export function pointerGetter(
  mouseEvent: MouseEvent | TouchEvent,
  areaRect: DOMRect | undefined,
  areaTransform: ZoomTransform,
) {
  let localX: number;
  let localY: number;

  if ("offsetX" in mouseEvent) {
    localX = mouseEvent.offsetX;
    localY = mouseEvent.offsetY;
  } else {
    if (!areaRect) return [0, 0];
    const clientX = mouseEvent.touches[0]?.clientX ?? mouseEvent.changedTouches[0]?.clientX;
    const clientY = mouseEvent.touches[0]?.clientY ?? mouseEvent.changedTouches[0]?.clientY;
    localX = clientX - areaRect.left;
    localY = clientY - areaRect.top;
  }

  const px = (localX - areaTransform.x) / areaTransform.k;
  const py = (localY - areaTransform.y) / areaTransform.k;

  return [px, py];
}
