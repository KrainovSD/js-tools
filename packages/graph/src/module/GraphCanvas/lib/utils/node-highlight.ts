import { colorToRgb, extractRgb, fadeRgb, rgbAnimationByProgress } from "@/lib";
import type { NodeOptionsInterface } from "../../types";
import { animationByProgress } from "./animation-by-progress";

type NodeHighlightOptions<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  nodeOptions: Required<NodeOptionsInterface<NodeData, LinkData>>;
  highlightProgress: number;
  highlightForNodeColor: string | null;
  highlightForNodeSizingAdditional: number;
  highlightForNodeSizingAdditionalCoefficient: number;
  highlightForNodeBorderColor: string | null;
  highlightForNodeBorderSizingAdditional: number;
  highlightForTextSizingAdditional: number;
  highlightForTextShiftXAdditional: number;
  highlightForTextShiftYAdditional: number;
  highlightForTextWeightAdditional: number;
  highlightForLabelSizingAdditional: number;
  highlightForLabelWeightAdditional: number;
};

export function nodeHighlight<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(opts: NodeHighlightOptions<NodeData, LinkData>) {
  let color = opts.nodeOptions.color;
  let borderColor = opts.nodeOptions.borderColor;
  let borderWidth = opts.nodeOptions.borderWidth;
  let radiusInitial = opts.nodeOptions.radius;
  let widthInitial = opts.nodeOptions.width;
  let heightInitial = opts.nodeOptions.height;
  let textSize = opts.nodeOptions.textSize;
  let textShiftX = opts.nodeOptions.textShiftX;
  let textShiftY = opts.nodeOptions.textShiftY;
  let textWeight = opts.nodeOptions.textWeight;
  let labelSize = opts.nodeOptions.labelSize;
  let labelWeight = opts.nodeOptions.labelWeight;
  let sizeCoefficient = 1;

  if (opts.highlightForNodeColor) {
    /** Color */
    const colorRgb = extractRgb(colorToRgb(color));
    const colorRgbHighlight = extractRgb(colorToRgb(opts.highlightForNodeColor));
    if (colorRgb && colorRgbHighlight) {
      const colorFadeAnimation = rgbAnimationByProgress(
        colorRgb,
        colorRgbHighlight,
        opts.highlightProgress,
      );
      color = `rgb(${colorFadeAnimation.r}, ${colorFadeAnimation.g}, ${colorFadeAnimation.b})`;
    }
  }
  if (opts.nodeOptions.shape === "circle") {
    /** Radius */
    radiusInitial = animationByProgress(
      radiusInitial,
      opts.highlightForNodeSizingAdditional,
      opts.highlightProgress,
    );
  }
  if (opts.nodeOptions.shape === "square" || opts.nodeOptions.shape === "text") {
    /** Size */
    sizeCoefficient = animationByProgress(
      sizeCoefficient,
      opts.highlightForNodeSizingAdditionalCoefficient,
      opts.highlightProgress,
    );

    widthInitial *= sizeCoefficient;
    heightInitial *= sizeCoefficient;
  }

  if (opts.highlightForNodeBorderColor) {
    /** Border Color */
    const colorRgb = extractRgb(colorToRgb(borderColor));
    const colorRgbHighlight = extractRgb(colorToRgb(opts.highlightForNodeBorderColor));
    if (colorRgb && colorRgbHighlight) {
      const colorFadeAnimation = rgbAnimationByProgress(
        colorRgb,
        colorRgbHighlight,
        opts.highlightProgress,
      );
      borderColor = `rgb(${colorFadeAnimation.r}, ${colorFadeAnimation.g}, ${colorFadeAnimation.b})`;
    }
  }
  /** Border Width */
  borderWidth = animationByProgress(
    borderWidth,
    opts.highlightForNodeBorderSizingAdditional,
    opts.highlightProgress,
  );

  /** Text Size */
  textSize = animationByProgress(
    textSize,
    opts.highlightForTextSizingAdditional,
    opts.highlightProgress,
  );
  /** Text Shift X */
  textShiftX = animationByProgress(
    textShiftX,
    opts.highlightForTextShiftXAdditional,
    opts.highlightProgress,
  );
  /** Text Shift Y */
  textShiftY = animationByProgress(
    textShiftY,
    opts.highlightForTextShiftYAdditional,
    opts.highlightProgress,
  );
  /** Text Weight */
  textWeight = animationByProgress(
    textWeight,
    opts.highlightForTextWeightAdditional,
    opts.highlightProgress,
  );

  if (opts.nodeOptions.label) {
    /** Label Size */
    labelSize = animationByProgress(
      labelSize,
      opts.highlightForLabelSizingAdditional,
      opts.highlightProgress,
    );
    /** Label Weight */
    labelWeight = animationByProgress(
      labelWeight,
      opts.highlightForLabelWeightAdditional,
      opts.highlightProgress,
    );
  }

  return {
    color,
    borderColor,
    borderWidth,
    radiusInitial,
    widthInitial,
    heightInitial,
    textSize,
    textShiftX,
    textShiftY,
    textWeight,
    labelSize,
    labelWeight,
    sizeCoefficient,
  };
}

type NodeFadingOptions<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  nodeOptions: Required<NodeOptionsInterface<NodeData, LinkData>>;
  highlightProgress: number;
  highlightForNodeFadingMin: number;
  highlightForTextFadingMin: number;
  highlightForLabelFadingMin: number;
  highlightForNodeColorFading: boolean;
};
export function nodeFade<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(opts: NodeFadingOptions<NodeData, LinkData>) {
  let alpha = opts.nodeOptions.alpha;
  let color = opts.nodeOptions.color;
  let textAlpha = opts.nodeOptions.textAlpha;
  let labelAlpha = opts.nodeOptions.labelAlpha;

  /** Alpha */
  const alphaMin = opts.highlightForNodeFadingMin < alpha ? opts.highlightForNodeFadingMin : alpha;
  alpha = animationByProgress(alphaMin, alpha - alphaMin, 1 - opts.highlightProgress);
  /** Text Alpha */
  const textAlphaMin =
    opts.highlightForTextFadingMin < textAlpha ? opts.highlightForTextFadingMin : textAlpha;
  textAlpha = animationByProgress(
    textAlphaMin,
    textAlpha - textAlphaMin,
    1 - opts.highlightProgress,
  );
  if (opts.nodeOptions.label) {
    /** Label Alpha */
    const labelAlphaMin =
      opts.highlightForLabelFadingMin < labelAlpha ? opts.highlightForLabelFadingMin : labelAlpha;
    labelAlpha = animationByProgress(
      labelAlphaMin,
      labelAlpha - labelAlphaMin,
      1 - opts.highlightProgress,
    );
  }
  if (opts.highlightForNodeColorFading) {
    /** Color Fading */
    const colorRgb = extractRgb(colorToRgb(color));
    if (colorRgb) {
      const colorRgbFade = fadeRgb(colorRgb, opts.highlightForNodeFadingMin);
      const colorFadeAnimation = rgbAnimationByProgress(
        colorRgb,
        colorRgbFade,
        opts.highlightProgress,
      );
      color = `rgb(${colorFadeAnimation.r}, ${colorFadeAnimation.g}, ${colorFadeAnimation.b})`;
      alpha = opts.nodeOptions.alpha;
    }
  }

  return {
    alpha,
    color,
    textAlpha,
    labelAlpha,
  };
}
