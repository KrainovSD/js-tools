import { COLOR_FORMATS } from "../../constants";

export function getColorFormat(color: string) {
  if (color.startsWith("#")) {
    return COLOR_FORMATS.Hex;
  }
  if (color.startsWith("rgba")) {
    return COLOR_FORMATS.Rgba;
  }
  if (color.startsWith("rgb")) {
    return COLOR_FORMATS.Rgb;
  }
  if (color.startsWith("hsl")) {
    return COLOR_FORMATS.Hsl;
  }
}
