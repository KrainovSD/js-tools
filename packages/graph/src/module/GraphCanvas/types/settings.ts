import type { LinkInterface, NodeInterface } from "@/types";
import type { GraphState } from "./graph";

export type GraphSettingsInterface<NodeData extends Record<string, unknown>> = {
  highlightOnlyRoot?: boolean;
  highlightFadingMin?: number;
  highlightTextFadingMin?: number;
  highlightSizingAdditional?: number;
  highlightTextSizingAdditional?: number;
  highlightTextShiftXAdditional?: number;
  highlightTextShiftYAdditional?: number;
  highlightTextWeightAdditional?: number;
  highlightTextWidthAdditional?: number;
  highlightByHover?: boolean;
  highlightDownStep?: number;
  highlightUpStep?: number;
  stickAfterDrag?: boolean;
  zoomExtent?: [number, number];
  zoomInitial?: {
    k?: number;
    x?: number;
    y?: number;
  } | null;
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
  collideRadius?: NodeIterationPropsInterface<NodeData, LinkData> | number | null;
  collideAdditionalRadius?: number;
  collideStrength?: number;
  collideIterations?: number;
  linkDistance?: LinkIterationPropsInterface<NodeData, LinkData> | number;
  linkStrength?: LinkIterationPropsInterface<NodeData, LinkData> | number;
  linkIterations?: number;
  chargeStrength?: NodeIterationPropsInterface<NodeData, LinkData> | number;
  chargeDistanceMax?: number;
  chargeDistanceMin?: number;
  centerPosition?: { x?: number; y?: number };
  centerStrength?: number;
  xForce?: NodeIterationPropsInterface<NodeData, LinkData> | number;
  xStrength?: NodeIterationPropsInterface<NodeData, LinkData> | number;
  yForce?: NodeIterationPropsInterface<NodeData, LinkData> | number;
  yStrength?: NodeIterationPropsInterface<NodeData, LinkData> | number;
};

export type NodeSettingsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  idGetter?: NodeIterationPropsInterface<NodeData, LinkData, string | number>;
  options?:
    | NodeIterationPropsInterface<NodeData, LinkData, NodeOptionsInterface>
    | NodeOptionsInterface;
};

export type NodeOptionsInterface = {
  highlightFading?: boolean;
  highlightSizing?: boolean;
  highlightTextFading?: boolean;
  highlightTextSizing?: boolean;
  highlightColor?: boolean;
  borderColor?: string;
  borderWidth?: number;
  radius?: number;
  width?: number;
  alpha?: number;
  color?: string;
  textVisible?: boolean;
  text?: string | null;
  textAlpha?: number;
  textShiftY?: number;
  textShiftX?: number;
  textFont?: string;
  textSize?: number;
  textColor?: string;
  textAlign?: CanvasTextAlign;
  textWidth?: number;
  textStyle?: TextStyleEnum;
  textWeight?: number;
  textGap?: number;
};

export type NodeIterationPropsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
  Return = number,
> = (
  node: NodeInterface<NodeData>,
  i: number,
  nodes: NodeInterface<NodeData>[],
  state?: GraphState<NodeData, LinkData>,
) => Return;

export type LinkSettingsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  options?:
    | LinkIterationPropsInterface<NodeData, LinkData, LinkOptionsInterface>
    | LinkOptionsInterface;
};

export type LinkOptionsInterface = {
  alpha?: number;
  color?: string;
  width?: number;
  highlightFading?: boolean;
};

export type LinkIterationPropsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
  Return = number,
> = (
  link: LinkInterface<NodeData, LinkData>,
  i: number,
  links: LinkInterface<NodeData, LinkData>[],
  state?: GraphState<NodeData, LinkData>,
) => Return;

export type TextStyleEnum = "normal" | "italic" | "oblique";
