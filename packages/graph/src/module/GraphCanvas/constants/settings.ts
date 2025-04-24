import type { LinkData, NodeData } from "@/app/types";
import { dragPlaceCoefficientGetter } from "../lib";
import type {
  ForceSettingsInterface,
  GraphSettingsInterface,
  LinkOptionsInterface,
  LinkSettingsInterface,
  NodeOptionsInterface,
  NodeSettingsInterface,
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
  highlightByNodeNodeSizingAdditional: 0.5,
  highlightByNodeNodeColorFadingMin: 0.15,
  highlightByNodeTextShiftXAdditional: 0,
  highlightByNodeTextShiftYAdditional: 2,
  highlightByNodeTextSizingAdditional: 1,
  highlightByNodeTextWeightAdditional: 0,
  highlightByNodeTextWidthAdditional: 10,
  highlightByNodeLinkFadingMin: 0.21,
  highlightByNodeNodeFadingMin: 0.21,
  highlightByNodeTextFadingMin: 0.21,
  highlightByNodeArrowFadingMin: 0.21,
  highlightByNodeOnlyRoot: true,
  highlightByLinkNodeSizingAdditional: 0.5,
  highlightByLinkNodeColorFadingMin: 0.15,
  highlightByLinkTextShiftXAdditional: 0,
  highlightByLinkTextShiftYAdditional: 2,
  highlightByLinkTextSizingAdditional: 1,
  highlightByLinkTextWeightAdditional: 0,
  highlightByLinkTextWidthAdditional: 10,
  highlightByLinkLinkFadingMin: 0.21,
  highlightByLinkNodeFadingMin: 0.21,
  highlightByLinkTextFadingMin: 0.21,
  highlightByLinkArrowFadingMin: 0.21,
  highlightByLinkOnlyRoot: true,
  stickAfterDrag: false,
  highlightByHoverNode: true,
  highlightByHoverLink: true,
  hoverLinkThreshold: 2,

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
  Required<NodeSettingsInterface<NodeData, LinkData>>,
  "options" | "idGetter"
> = {
  cache: false,
};

export const NODE_OPTIONS: Omit<
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
  highlightByNodeNodeFading: true,
  highlightByNodeNodeColor: false,
  highlightByNodeNodeSizing: true,
  highlightByNodeTextFading: true,
  highlightByNodeTextSizing: true,

  highlightByLinkNodeFading: false,
  highlightByLinkNodeColor: false,
  highlightByLinkNodeSizing: true,
  highlightByLinkTextFading: false,
  highlightByLinkTextSizing: true,
};

export const LINK_SETTINGS: Omit<Required<LinkSettingsInterface<NodeData, LinkData>>, "options"> = {
  cache: false,
  particles: true,
};

export const LINK_OPTIONS: Omit<
  Required<LinkOptionsInterface<Record<string, unknown>, Record<string, unknown>>>,
  "color" | "width" | "drawLink" | "drawExtraLink" | "arrowColor"
> = {
  alpha: 1,
  highlightByNodeLinkFading: true,
  highlightByNodeArrowFading: true,
  highlightByLinkLinkFading: false,
  highlightByLinkArrowFading: false,
  pretty: true,
  arrow: true,
  arrowAlpha: 1,
  arrowSize: 2,
  arrowReverseAppear: true,
  particleAlpha: 1,
  particleColor: "#000000FF",
  particleCount: 2,
  particleRadius: 0.5,
  particleSteps: 60,
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
