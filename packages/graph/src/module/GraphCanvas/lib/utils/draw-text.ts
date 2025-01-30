import type { CachedNodeTextInterface } from "@/types";
import type { TextStyleEnum, TextWeightEnum } from "../../types";

export type DrawTextOptions = {
  id: string | number;
  x: number;
  y: number;
  text: string;
  textSize: number;
  textStyle: TextStyleEnum;
  textWeight: TextWeightEnum;
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

  const spaceWidth = context.measureText(" ").width;
  const lines: string[] = [];
  let lineWidth = 0;
  let line = "";

  for (const word of text.split(" ")) {
    const size = context.measureText(word).width;
    lineWidth += size;

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

  cachedNodeText[id] = lines;
  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * textSize + index * textGap);
  });
}
