import type { NodeOptionsInterface, NodeSettingsInterface } from "../types/node-settings";

export const NODE_SETTINGS: Omit<
  Required<NodeSettingsInterface<Record<string, unknown>, Record<string, unknown>>>,
  "options" | "idGetter" | "text" | "label"
> = {
  smartCache: true,
  textScaleSteps: [],
  nodeRadiusFlexible: true,
  nodeRadiusLinkCountForStep: 5,
  nodeRadiusIncrementByStep: 1,
  nodeRadiusMaxLinearSteps: 5,
  nodeRadiusLinkCountDividerForLog: 25,
  nodeRadiusLogFactor: 2.5,
  nodeSizeFlexible: true,
  nodeSizeLinkCountForStep: 5,
  nodeSizeIncrementByStep: 0.1,
  nodeSizeMaxLinearSteps: 5,
  nodeSizeLinkCountDividerForLog: 25,
  nodeSizeLogFactor: 2.5,
  textScaleMin: 1.5,
  textScaleMax: 18,
  textSizeMin: 3.5,
  textSizeMax: 1.5,
  textShiftYMin: 4,
  textShiftYMax: 2.5,
  textNodeDebug: false,
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
  shape: "circle",
  height: 10,
  width: 15,
  borderRadius: 0,
  radius: 4,
  alpha: 1,
  labelXPadding: 1,
  labelYPadding: 1,
  borderWidth: 0.1,
  borderColor: "#000000FF",
  textAlpha: 1,
  textWidth: 20,
  textShiftX: 0,
  textFont: "Arial",
  textAlign: "center" as CanvasTextAlign,
  textColor: "#d2d2d2",
  textStyle: "normal",
  textWeight: 500,
  textGap: 0,
  labelAlpha: 1,
  labelAlign: "center",
  labelColor: "#ffffff",
  labelFont: "Arial",
  labelGap: 0,
  labelSize: 3.5,
  labelStyle: "normal",
  labelWeight: 500,
  labelWidth: 20,
};

export const PERFORMANCE_NODE_SETTINGS: Omit<
  Required<NodeSettingsInterface<Record<string, unknown>, Record<string, unknown>>>,
  "options" | "idGetter" | "text" | "label"
> = {
  ...NODE_SETTINGS,
  nodeRadiusFlexible: false,
  nodeSizeFlexible: false,
};

export const PERFOMANCE_NODE_OPTIONS: Omit<
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
  ...NODE_OPTIONS,
};
