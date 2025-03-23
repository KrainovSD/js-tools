import { dragPlaceCoefficientGetter } from "../lib";
import type {
  ForceSettingsInterface,
  GraphSettingsInterface,
  LinkOptionsInterface,
  NodeOptionsInterface,
} from "../types";

export const FORCE_SETTINGS: Required<
  ForceSettingsInterface<Record<string, unknown>, Record<string, unknown>>
> = {
  centerPosition: {},
  centerStrength: 1,
  collideStrength: 0.1,
  collideAdditionalRadius: 4,
  collideIterations: 2,
  collideOffMax: { links: 0, nodes: 0 },
  collideOn: true,
  chargeStrength: -40,
  chargeDistanceMax: Infinity,
  chargeDistanceMin: 1,
  xForce: 0,
  xStrength: 0.1,
  yForce: 0,
  yStrength: 0.1,
  linkDistance: 30,
  linkIterations: 1,
  linkStrength: 1,
  collideRadius: null,
};

export const GRAPH_SETTINGS: Required<GraphSettingsInterface<Record<string, unknown>>> = {
  zoomExtent: [0.3, 10] as [number, number],
  translateExtent: [[], []],
  translateExtentEnable: true,
  translateExtentCoefficient: [3, 3],
  highlightSizingAdditional: 0.5,
  highlightColorFadingMin: 0.15,
  highlightTextShiftXAdditional: 0,
  highlightTextShiftYAdditional: 2,
  highlightTextSizingAdditional: 1,
  highlightTextWeightAdditional: 0,
  highlightTextWidthAdditional: 10,
  highlightOnlyRoot: true,
  stickAfterDrag: false,
  highlightByHover: true,
  highlightLinkFadingMin: 0.21,
  highlightFadingMin: 0.21,
  highlightTextFadingMin: 0.21,
  highlightArrowFadingMin: 0.21,
  highlightDownStep: 0.2,
  highlightUpStep: 0.2,
  dragPlaceCoefficient: dragPlaceCoefficientGetter,
  nodeRadiusInitial: 4,
  nodeRadiusCoefficient: 5,
  nodeRadiusFactor: 1,
  nodeRadiusFlexible: true,
  zoomInitial: null,
  showDrawTime: true,
  showDrawTimeEveryTick: false,
};

export const NODE_SETTINGS: Omit<
  Required<NodeOptionsInterface<Record<string, unknown>, Record<string, unknown>>>,
  | "color"
  | "text"
  | "textVisible"
  | "textSize"
  | "textShiftY"
  | "nodeDraw"
  | "nodeExtraDraw"
  | "textDraw"
  | "textExtraDraw"
> = {
  alpha: 1,
  textAlpha: 1,
  borderColor: "#000000FF",
  borderWidth: 0.1,
  textWidth: 20,
  textShiftX: 0,
  textFont: "Arial",
  textAlign: "center" as CanvasTextAlign,
  textColor: "#333",
  radius: 4,
  textStyle: "normal",
  textWeight: 500,
  textGap: 1,
  highlightFading: true,
  highlightColor: false,
  highlightSizing: true,
  highlightTextFading: true,
  highlightTextSizing: true,
};

export const LINK_SETTINGS: Omit<
  Required<LinkOptionsInterface<Record<string, unknown>, Record<string, unknown>>>,
  "color" | "width" | "drawLink" | "drawExtraLink" | "arrowColor"
> = {
  alpha: 1,
  highlightFading: true,
  pretty: true,
  arrow: true,
  arrowAlpha: 1,
  arrowSize: 2,
  arrowHighlightFading: true,
  arrowReverseAppear: true,
};

export const COMMON_SETTINGS = {
  linkColorZoomFar: "#999",
  linkColorZoomNear: "#000000FF",
  linkWidthZoomFar: 1,
  linkWidthZoomNear: 0.1,
  linkWidthZoomBorder: 1,
  linkColorZoomBorder: 1,
  nodeTextScaleMin: 1.5,
  nodeTextScaleMax: 20,
  nodeTextSizeMin: 1.5,
  nodeTextSizeMax: 3.5,
  nodeTextShiftYMin: 2.5,
  nodeTextShiftYMax: 4,
  nodeTextChangeStepCount: 200,
};
