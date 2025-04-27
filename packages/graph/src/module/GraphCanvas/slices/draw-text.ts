import type { CachedNodeTextInterface } from "@/types";
import type { TextStyleEnum } from "../types";

export type DrawTextOptions = {
  id: string | number;
  x: number;
  y: number;
  text: string;
  textSize: number;
  textStyle: TextStyleEnum;
  textWeight: number;
  textFont: string;
  textColor: string;
  textGap: number;
  textAlign: CanvasTextAlign;
  context: CanvasRenderingContext2D;
  cachedNodeText: CachedNodeTextInterface;
  maxWidth?: number;
};

const SPACE = " ";

export function drawText({
  context,
  id,
  textAlign,
  textColor,
  textFont,
  textStyle,
  textGap,
  textWeight,
  textSize,
  text,
  x,
  y,
  cachedNodeText,
  maxWidth,
}: DrawTextOptions) {
  context.font = `${textStyle} normal ${textWeight} ${textSize}px ${textFont}`;
  context.fillStyle = textColor;
  context.textAlign = textAlign;

  if (cachedNodeText[id] != undefined) {
    cachedNodeText[id].forEach((line, index) => {
      context.fillText(line, x, y + index * textSize + index * textGap);
    });

    return;
  }

  if (maxWidth == undefined || context.measureText(text).width <= maxWidth) {
    cachedNodeText[id] = [text];
    context.fillText(text, x, y);

    return;
  }

  const lines = getTextLines({
    context,
    maxWidth,
    text,
    textAlign,
    textColor,
    textFont,
    textSize,
    textStyle,
    textWeight,
  });

  cachedNodeText[id] = lines;
  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * textSize + index * textGap);
  });
}

export type GetTextLines = {
  text: string;
  textSize: number;
  textStyle: TextStyleEnum;
  textWeight: number;
  textFont: string;
  textColor: string;
  textAlign: CanvasTextAlign;
  context: CanvasRenderingContext2D;
  maxWidth: number;
};
export function getTextLines({
  context,
  textAlign,
  textColor,
  textFont,
  textStyle,
  textWeight,
  textSize,
  text,
  maxWidth,
}: GetTextLines) {
  context.font = `${textStyle} normal ${textWeight} ${textSize}px ${textFont}`;
  context.fillStyle = textColor;
  context.textAlign = textAlign;

  const spaceWidth = context.measureText(" ").width;
  const lines: string[] = [];
  let lineWidth = 0;
  let line = "";

  for (const word of text.split(" ")) {
    const size = context.measureText(word).width;
    lineWidth += size + spaceWidth;

    if (line === "") {
      line = word;

      continue;
    }
    if (lineWidth > maxWidth) {
      lineWidth = 0;
      lines.push(line);
      line = word;
    } else {
      lineWidth += spaceWidth;
      line += `${SPACE}${word}`;
    }
  }

  if (line !== "") lines.push(line);

  return lines;
}
