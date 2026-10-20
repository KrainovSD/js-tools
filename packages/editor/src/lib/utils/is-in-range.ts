import type { SelectionRange } from "@codemirror/state";
import { isRangeOverlap } from "./is-range-overlap";

export function isInRange(ranges: readonly SelectionRange[], text: [number, number]) {
  return ranges.some((range) => isRangeOverlap([range.from, range.to], text));
}
