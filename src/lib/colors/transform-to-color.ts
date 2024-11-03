import { isString } from "../typings";
import { getColorFormat } from "./get-color-format";

export function transformToColor(currentColor: unknown, defaultColor: string = "black") {
  if (!isString(currentColor)) return defaultColor;

  let correctColor = currentColor;

  if (!getColorFormat(correctColor)) {
    correctColor = `#${correctColor}`;
    if (!getColorFormat(correctColor)) {
      return defaultColor;
    }
  }

  return correctColor;
}
