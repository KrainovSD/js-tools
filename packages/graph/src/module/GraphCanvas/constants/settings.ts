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
  forces: true,
  centerForce: true,
  chargeForce: true,
  linkForce: true,
  xForce: true,
  yForce: true,
  collideForce: true,
  centerPosition: {},
  centerStrength: 1,
  collideStrength: 0.1,
  collideAdditionalRadius: 4,
  collideIterations: 2,
  collideOffMax: { links: 0, nodes: 0 },
  chargeStrength: -40,
  chargeDistanceMax: Infinity,
  chargeDistanceMin: 1,
  xPosition: 0,
  xStrength: 0.1,
  yPosition: 0,
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
  highlightUpFrames: 5,
  highlightDownFrames: 5,
  dragPlaceCoefficient: dragPlaceCoefficientGetter,
  zoomInitial: null,
  showDrawTime: true,
  showDrawTimeEveryTick: false,
};

export const NODE_SETTINGS: Omit<
  Required<NodeSettingsInterface<NodeData, LinkData>>,
  "options" | "idGetter"
> = {
  cache: true,
  highlightByNodeOnlyRoot: true,
  highlightByHoverNode: true,
  nodeRadiusFlexible: true,
  nodeSizeFlexible: true,
  textNodeDebug: true,
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
  nodeRadiusCoefficient: 5,
  nodeRadiusFactor: 1,
  nodeSizeCoefficient: 5,
  nodeSizeFactor: 0.1,
  highlightByNodeNodeSizingAdditional: 0.5,
  highlightByLinkNodeSizingAdditionalCoefficient: 0.35,
  highlightByNodeNodeColorFadingMin: 0.15,
  highlightByNodeTextShiftXAdditional: 0,
  highlightByNodeTextShiftYAdditional: 2,
  highlightByNodeTextSizingAdditional: 1,
  highlightByNodeTextWeightAdditional: 0,
  highlightByNodeTextWidthAdditional: 10,
  highlightByNodeNodeFadingMin: 0.21,
  highlightByNodeTextFadingMin: 0.21,
  highlightByLinkNodeSizingAdditional: 0.5,
  highlightByNodeNodeSizingAdditionalCoefficient: 0.35,
  highlightByLinkNodeColorFadingMin: 0.15,
  highlightByLinkTextShiftXAdditional: 0,
  highlightByLinkTextShiftYAdditional: 2,
  highlightByLinkTextSizingAdditional: 1,
  highlightByLinkTextWeightAdditional: 0,
  highlightByLinkTextWidthAdditional: 10,
  highlightByLinkNodeFadingMin: 0.21,
  highlightByLinkTextFadingMin: 0.21,
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
  shape: "text",
  height: 10,
  width: 15,
  borderRadius: 0,
  radius: 4,
  alpha: 1,
  textNodeXPadding: 5,
  textNodeYPadding: 3,
  borderWidth: 0.1,
  borderColor: "#000000FF",
  textAlpha: 1,
  textWidth: 20,
  textShiftX: 0,
  textFont: "Arial",
  textAlign: "center" as CanvasTextAlign,
  textColor: "#333",
  textStyle: "normal",
  textWeight: 500,
  textGap: 0,
};

export const LINK_SETTINGS: Omit<Required<LinkSettingsInterface<NodeData, LinkData>>, "options"> = {
  cache: true,
  particles: true,
  particleFlexSpeed: true,
  pretty: true,
  arrow: true,
  highlightByHoverLink: true,
  arrowByHighlight: true,
  highlightByNodeLinkFading: true,
  highlightByNodeArrowFading: true,
  highlightByLinkLinkFading: false,
  highlightByLinkArrowFading: false,
  particleFlexSpeedCoefficient: 4,
  hoverLinkThreshold: 2,
  highlightByNodeLinkFadingMin: 0.21,
  highlightByNodeArrowFadingMin: 0.21,
  highlightByLinkArrowFadingMin: 0.21,
  highlightByLinkLinkFadingMin: 0.21,
};

export const LINK_OPTIONS: Omit<
  Required<LinkOptionsInterface<Record<string, unknown>, Record<string, unknown>>>,
  "color" | "width" | "drawLink" | "drawExtraLink" | "arrowColor"
> = {
  alpha: 1,
  arrowAlpha: 1,
  arrowSize: 2,
  arrowBorderColor: "#000000FF",
  arrowBorderWidth: 0.1,
  particleAlpha: 1,
  particleColor: "#000000FF",
  particleBorderColor: "#000000FF",
  particleBorderWidth: 0.1,
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
  nodeRadius: 5,
  nodeSize: 5,
};
