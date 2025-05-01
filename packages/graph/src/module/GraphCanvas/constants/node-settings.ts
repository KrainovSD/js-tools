import type { NodeOptionsInterface, NodeSettingsInterface } from "../types/node-settings";

export const NODE_SETTINGS: Omit<
  Required<NodeSettingsInterface<Record<string, unknown>, Record<string, unknown>>>,
  "options" | "idGetter"
> = {
  cacheOptions: true,
  nodeRadiusFlexible: true,
  nodeRadiusCoefficient: 5,
  nodeRadiusFactor: 1,
  nodeSizeFlexible: true,
  nodeSizeCoefficient: 5,
  nodeSizeFactor: 0.1,
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
  textColor: "#333",
  textStyle: "normal",
  textWeight: 500,
  textGap: 0,
  label: null,
  labelAlpha: 1,
  labelAlign: "center",
  labelColor: "#333",
  labelFont: "Arial",
  labelGap: 0,
  labelSize: 3.5,
  labelStyle: "normal",
  labelWeight: 500,
  labelWidth: 20,
};
