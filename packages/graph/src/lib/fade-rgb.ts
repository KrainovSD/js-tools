import type { RGB } from "@/module/GraphCanvas";

export function fadeRgb(color: RGB, fade: number): RGB {
  return {
    r: color.r * (1 - fade),
    g: color.g * (1 - fade),
    b: color.b * (1 - fade),
  };
}
