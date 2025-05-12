import { colorToRgb, extractRgb, rgbAnimationByProgress } from "@/lib";
import type { LinkOptionsInterface } from "../../types";
import { animationByProgress } from "./animation-by-progress";

type LinkHighlightOptions<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  linkOptions: Required<LinkOptionsInterface<NodeData, LinkData>>;
  highlightProgress: number;
  arrow: boolean;
  arrowByHighlight: boolean;
  highlightForArrowBorderSizingAdditional: number;
  highlightForArrowBorderColor: string | null;
  highlightForArrowColor: string | null;
  highlightForArrowSizeAdditional: number;
  highlightForLinkColor: string | null;
  highlightForLinkSizeAdditional: number;
};

export function linkHighlight<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(opts: LinkHighlightOptions<NodeData, LinkData>) {
  const arrowVisible = opts.arrow && !opts.arrowByHighlight;

  let arrowAlpha = opts.arrowByHighlight ? 0 : opts.linkOptions.arrowAlpha;
  let color = opts.linkOptions.color;
  let width = opts.linkOptions.width;
  let arrowColor = opts.linkOptions.arrowColor;
  let arrowSize = opts.linkOptions.arrowSize;
  let arrowBorderWidth = opts.linkOptions.arrowBorderWidth;
  let arrowBorderColor = opts.linkOptions.arrowBorderColor;

  if (opts.arrow && opts.arrowByHighlight) {
    /** Highlighted */
    arrowAlpha = animationByProgress(0, opts.linkOptions.arrowAlpha, opts.highlightProgress);
  }

  if (opts.highlightForLinkColor) {
    /** Color */
    const colorRgb = extractRgb(colorToRgb(color));
    const colorRgbHighlight = extractRgb(colorToRgb(opts.highlightForLinkColor));
    if (colorRgb && colorRgbHighlight) {
      const colorFadeAnimation = rgbAnimationByProgress(
        colorRgb,
        colorRgbHighlight,
        opts.highlightProgress,
      );
      color = `rgb(${colorFadeAnimation.r}, ${colorFadeAnimation.g}, ${colorFadeAnimation.b})`;
    }
  }
  if (opts.highlightForArrowColor && arrowVisible) {
    /** Arrow Color */
    const colorRgb = extractRgb(colorToRgb(arrowColor));
    const colorRgbHighlight = extractRgb(colorToRgb(opts.highlightForArrowColor));
    if (colorRgb && colorRgbHighlight) {
      const colorFadeAnimation = rgbAnimationByProgress(
        colorRgb,
        colorRgbHighlight,
        opts.highlightProgress,
      );
      arrowColor = `rgb(${colorFadeAnimation.r}, ${colorFadeAnimation.g}, ${colorFadeAnimation.b})`;
    }
  }
  if (opts.highlightForArrowBorderColor && arrowVisible) {
    /** Arrow Border Color */
    const colorRgb = extractRgb(colorToRgb(arrowBorderColor));
    const colorRgbHighlight = extractRgb(colorToRgb(opts.highlightForArrowBorderColor));
    if (colorRgb && colorRgbHighlight) {
      const colorFadeAnimation = rgbAnimationByProgress(
        colorRgb,
        colorRgbHighlight,
        opts.highlightProgress,
      );
      arrowBorderColor = `rgb(${colorFadeAnimation.r}, ${colorFadeAnimation.g}, ${colorFadeAnimation.b})`;
    }
  }

  width = animationByProgress(width, opts.highlightForLinkSizeAdditional, opts.highlightProgress);
  if (arrowVisible) {
    arrowSize = animationByProgress(
      arrowSize,
      opts.highlightForArrowSizeAdditional,
      opts.highlightProgress,
    );
    arrowBorderWidth = animationByProgress(
      arrowBorderWidth,
      opts.highlightForArrowBorderSizingAdditional,
      opts.highlightProgress,
    );
  }

  return { arrowAlpha, color, width, arrowColor, arrowSize, arrowBorderWidth, arrowBorderColor };
}

type LinkFadeOptions<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  linkOptions: Required<LinkOptionsInterface<NodeData, LinkData>>;
  highlightProgress: number;
  arrow: boolean;
  arrowByHighlight: boolean;
  highlightForLinkFadingMin: number;
  highlightForArrowFadingMin: number;
};

export function linkFade<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(opts: LinkFadeOptions<NodeData, LinkData>) {
  let alpha = opts.linkOptions.alpha;
  let arrowAlpha = opts.arrowByHighlight ? 0 : opts.linkOptions.arrowAlpha;

  const alphaMin = opts.highlightForLinkFadingMin < alpha ? opts.highlightForLinkFadingMin : alpha;
  alpha = animationByProgress(alphaMin, alpha - alphaMin, 1 - opts.highlightProgress);
  if (opts.arrow && !opts.arrowByHighlight) {
    const arrowAlphaMin =
      opts.highlightForArrowFadingMin < arrowAlpha ? opts.highlightForArrowFadingMin : arrowAlpha;
    arrowAlpha = animationByProgress(
      arrowAlphaMin,
      arrowAlpha - arrowAlphaMin,
      1 - opts.highlightProgress,
    );
  }

  return { alpha, arrowAlpha };
}
