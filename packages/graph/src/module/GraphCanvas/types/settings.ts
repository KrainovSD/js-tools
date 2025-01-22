import type { ZoomTransform } from "d3-zoom";
import type { LinkInterface, NodeInterface } from "@/types";

export type GraphSettingsInterface<NodeData extends Record<string, unknown>> = {
  minHighlighFading?: number;
  highlightByHover?: boolean;
  stickAfterDrag?: boolean;
  zoomExtent?: [number, number];
  dragPlaceCoefficient?: (
    node: NodeInterface<NodeData>,
    pxEvent: number,
    pyEvent: number,
    radius: number,
  ) => number | undefined;
  nodeRadiusInitial?: number;
  nodeRadiusCoefficient?: number;
  nodeRadiusFactor?: number;
  nodeRadiusFlexible?: boolean;
};

export type ForceSettingsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  collideOn?: boolean;
  collideOffMax?: {
    nodes: number;
    links: number;
  };
  collideRadius?: NodeIterationPropsInterface<NodeData> | number | null;
  collideAdditionalRadius?: number;
  collideStrength?: number;
  collideIterations?: number;
  linkDistance?: LinkIterationPropsInterface<NodeData, LinkData> | number;
  linkStrength?: LinkIterationPropsInterface<NodeData, LinkData> | number;
  linkIterations?: number;
  chargeStrength?: NodeIterationPropsInterface<NodeData> | number;
  chargeDistanceMax?: number;
  chargeDistanceMin?: number;
  centerPosition?: { x?: number; y?: number };
  centerStrength?: number;
  xForce?: NodeIterationPropsInterface<NodeData> | number;
  xStrength?: NodeIterationPropsInterface<NodeData> | number;
  yForce?: NodeIterationPropsInterface<NodeData> | number;
  yStrength?: NodeIterationPropsInterface<NodeData> | number;
};

export type NodeSettingsInterface<NodeData extends Record<string, unknown>> = {
  idGetter?: NodeIterationPropsInterface<NodeData, string | number>;
  options?: NodeIterationPropsInterface<NodeData, NodeOptionsInterface> | NodeOptionsInterface;
};

export type NodeOptionsInterface = {
  borderColor?: string;
  borderWidth?: number;
  radius?: number;
  width?: number;
  alpha?: number;
  color?: string;
  textVisible?: boolean;
  text?: string | null;
  textShiftY?: number;
  textShiftX?: number;
  textFont?: string;
  textSize?: number;
  textColor?: string;
  textAlign?: CanvasTextAlign;
  textWidth?: number;
  textStyle?: TextStyleEnum;
  textWeight?: TextWeightEnum;
  textGap?: number;
};

export type NodeIterationPropsInterface<
  NodeData extends Record<string, unknown>,
  Return = number,
> = (
  node: NodeInterface<NodeData>,
  i: number,
  nodes: NodeInterface<NodeData>[],
  transform?: ZoomTransform,
  // graphSettings?: Required<GraphSettingsInterface<NodeData>>,
) => Return;

export type LinkSettingsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  options?:
    | LinkIterationPropsInterface<NodeData, LinkData, GraphCanvasLinkOptions>
    | GraphCanvasLinkOptions;
};

export type GraphCanvasLinkOptions = {
  alpha?: number;
  color?: string;
  width?: number;
};

export type LinkIterationPropsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
  Return = number,
> = (
  link: LinkInterface<NodeData, LinkData>,
  i: number,
  links: LinkInterface<NodeData, LinkData>[],
  transform?: ZoomTransform | null,
) => Return;

export type TextStyleEnum = "normal" | "italic" | "oblique";
export type TextWeightEnum =
  | "normal"
  | "bold"
  | "bolder"
  | "lighter"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";
