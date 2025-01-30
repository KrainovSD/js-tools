export function isRangeOverlap(range: [number, number], text: [number, number]) {
  return range[0] <= text[1] && text[0] <= range[1];
}
