import { COLOR_FORMATS } from "../../constants";
import type { ColorFormat } from "../../types";
import { isString } from "../typings";
import { getColorFormat } from "./get-color-format";

export function transformToColor(
  currentColor: unknown,
  defaultColor: string = "black",
  defaultFormat: ColorFormat = COLOR_FORMATS.Hex,
) {
  if (!isString(currentColor)) return defaultColor;

  let correctColor = currentColor;

  if (!getColorFormat(correctColor)) {
    switch (defaultFormat) {
      case COLOR_FORMATS.Hex: {
        correctColor = `#${correctColor}`;
        break;
      }
      case COLOR_FORMATS.Rgb: {
        correctColor = `rgb(${correctColor})`;
        break;
      }
      case COLOR_FORMATS.Rgba: {
        correctColor = `rgba(${correctColor})`;
        break;
      }
      case COLOR_FORMATS.Hsl: {
        correctColor = `hsl(${correctColor})`;
        break;
      }
      default: {
        correctColor = `#${correctColor}`;
        break;
      }
    }
  }

  return correctColor;
}
