import type { TextStyleEnum } from "../types";

export type DrawTextOptions = {
  lines: string[];
  x: number;
  y: number;
  textSize: number;
  textStyle: TextStyleEnum;
  textWeight: number;
  textFont: string;
  textColor: string;
  textGap: number;
  textAlign: CanvasTextAlign;
  context: CanvasRenderingContext2D;
};

const SPACE = " ";

export function drawText({
  context,
  textAlign,
  textColor,
  textFont,
  textStyle,
  textGap,
  textWeight,
  textSize,
  x,
  y,
  lines,
}: DrawTextOptions) {
  context.font = `${textStyle} normal ${textWeight} ${textSize}px ${textFont}`;
  context.fillStyle = textColor;
  context.textAlign = textAlign;

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
  let currentMaxSize = 0;

  for (const word of text.split(" ")) {
    const size = context.measureText(word).width;
    lineWidth += size + spaceWidth;

    if (line === "") {
      line = word;

      continue;
    }
    if (lineWidth > maxWidth) {
      const initialSize = lineWidth - size - spaceWidth;
      if (initialSize > currentMaxSize) currentMaxSize = initialSize;

      lineWidth = size;
      lines.push(line);
      line = word;
    } else {
      lineWidth += spaceWidth;
      line += `${SPACE}${word}`;
    }
  }

  if (line !== "") lines.push(line);
  if (lineWidth > currentMaxSize) currentMaxSize = lineWidth;

  return { lines, currentMaxSize };
}
