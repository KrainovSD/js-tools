import type { RGB } from "@/types";

export function fadeRgb(color: RGB, fade: number): RGB {
  const gray = (color.r + color.g + color.b) / 3;

  return {
    r: color.r * fade + gray * (1 - fade),
    g: color.g * fade + gray * (1 - fade),
    b: color.b * fade + gray * (1 - fade),
  };
}
