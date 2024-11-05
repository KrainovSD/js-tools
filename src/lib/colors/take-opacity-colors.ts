import { COLOR_FORMATS } from "../../constants";
import { getColorFormat } from "./get-color-format";
import { transformHEXtoRGB } from "./transform-hex-to-rgb";
import { transformRGBtoRGBA } from "./transform-rgb-to-rgba";
import { transformRGBAtoRGB } from "./transform-rgba-to-rgb";

export function takeOpacityColors(color: string | undefined, opacities: number[]) {
  let rgbColor = color;

  if (!rgbColor) return [];

  if (getColorFormat(rgbColor) === COLOR_FORMATS.Hex) {
    rgbColor = transformHEXtoRGB(rgbColor);
  } else if (getColorFormat(rgbColor) === COLOR_FORMATS.Rgba) {
    rgbColor = transformRGBAtoRGB(rgbColor);
  }

  if (getColorFormat(rgbColor) !== COLOR_FORMATS.Rgb) return [];

  return [...opacities.map((opacity) => transformRGBtoRGBA(rgbColor, opacity))];
}
