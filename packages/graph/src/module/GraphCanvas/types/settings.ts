import type { LinkInterface, NodeInterface } from "@/types";
import type { GraphState } from "./graph";

export type GraphSettingsInterface<NodeData extends Record<string, unknown>> = {
  highlightOnlyRoot?: boolean;
  highlightFadingMin?: number;
  highlightLinkFadingMin?: number;
  highlightArrowFadingMin?: number;
  highlightColorFadingMin?: number;
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
  translateExtent?: [[number?, number?], [number?, number?]];
  translateExtentCoefficient?: number | [number, number];
  translateExtentEnable?: boolean;
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
  showDrawTime?: boolean;
  showDrawTimeEveryTick?: boolean;
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
  cache?: boolean;
  idGetter?: NodeIterationPropsInterface<NodeData, LinkData, string | number>;
  options?:
    | NodeIterationPropsInterface<NodeData, LinkData, NodeOptionsInterface<NodeData, LinkData>>
    | NodeOptionsInterface<NodeData, LinkData>;
};

export type NodeOptionsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  nodeDraw?:
    | ((
        node: NodeInterface<NodeData>,
        options: Required<NodeOptionsInterface<NodeData, LinkData>>,
        state: GraphState<NodeData, LinkData>,
      ) => void)
    | null;
  textDraw?:
    | ((
        node: NodeInterface<NodeData>,
        options: Required<NodeOptionsInterface<NodeData, LinkData>>,
        state: GraphState<NodeData, LinkData>,
      ) => void)
    | null;
  nodeExtraDraw?:
    | ((
        node: NodeInterface<NodeData>,
        options: Required<NodeOptionsInterface<NodeData, LinkData>>,
        state: GraphState<NodeData, LinkData>,
      ) => void)
    | null;
  textExtraDraw?:
    | ((
        node: NodeInterface<NodeData>,
        options: Required<NodeOptionsInterface<NodeData, LinkData>>,
        state: GraphState<NodeData, LinkData>,
      ) => void)
    | null;
  highlightFading?: boolean;
  highlightSizing?: boolean;
  highlightTextFading?: boolean;
  highlightTextSizing?: boolean;
  highlightColor?: boolean;
  borderColor?: string;
  borderWidth?: number;
  radius?: number;
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
  cache?: boolean;
  options?:
    | LinkIterationPropsInterface<NodeData, LinkData, LinkOptionsInterface<NodeData, LinkData>>
    | LinkOptionsInterface<NodeData, LinkData>;
};

export type LinkOptionsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  drawLink?:
    | ((
        link: LinkInterface<NodeData, LinkData>,
        options: Required<LinkOptionsInterface<NodeData, LinkData>>,
        state: GraphState<NodeData, LinkData>,
      ) => void)
    | null;
  drawExtraLink?:
    | ((
        link: LinkInterface<NodeData, LinkData>,
        options: Required<LinkOptionsInterface<NodeData, LinkData>>,
        state: GraphState<NodeData, LinkData>,
      ) => void)
    | null;
  alpha?: number;
  color?: string;
  width?: number;
  highlightFading?: boolean;
  pretty?: boolean;
  arrow?: boolean;
  arrowAlpha?: number;
  arrowColor?: string;
  arrowSize?: number;
  arrowHighlightFading?: boolean;
  arrowReverseAppear?: boolean;
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
