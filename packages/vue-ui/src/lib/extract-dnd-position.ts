export function extractDragPosition(event: TouchEvent | MouseEvent) {
  let clientX = 0;
  let clientY = 0;
  if ("touches" in event) {
    clientX = event.touches[0]?.clientX;
    clientY = event.touches[0]?.clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  return { clientX, clientY };
}
