import type { RGB } from "@/types";

export function rgbAnimationByProgress(start: RGB, end: RGB, progress: number): RGB {
  return {
    r: start.r + (end.r - start.r) * progress,
    g: start.g + (end.g - start.g) * progress,
    b: start.b + (end.b - start.b) * progress,
  };
}
