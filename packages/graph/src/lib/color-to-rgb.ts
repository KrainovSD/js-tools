import {
  COLOR_FORMATS,
  getColorFormat,
  transformHEXtoRGB,
  transformRGBAtoRGB,
} from "@krainovsd/js-helpers";

export function colorToRgb(color: string) {
  const format = getColorFormat(color);

  switch (format) {
    case COLOR_FORMATS.Hex: {
      return transformHEXtoRGB(color);
    }
    case COLOR_FORMATS.Rgb: {
      return color;
    }
    case COLOR_FORMATS.Rgba: {
      return transformRGBAtoRGB(color);
    }
    default: {
      return null;
    }
  }
}
