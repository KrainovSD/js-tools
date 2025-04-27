import type { LinkInterface, NodeInterface, NodeShape } from "@/types";
import type { GraphState } from "./graph";

export type GraphSettingsInterface<NodeData extends Record<string, unknown>> = {
  highlightDownFrames?: number;
  highlightUpFrames?: number;
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
  ) => number | undefined;
  showDrawTime?: boolean;
  showDrawTimeEveryTick?: boolean;
};

export type ForceSettingsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  forces?: boolean;
  xForce?: boolean;
  yForce?: boolean;
  chargeForce?: boolean;
  centerForce?: boolean;
  collideForce?: boolean;
  linkForce?: boolean;

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
  xPosition?: NodeIterationPropsInterface<NodeData, LinkData> | number;
  xStrength?: NodeIterationPropsInterface<NodeData, LinkData> | number;
  yPosition?: NodeIterationPropsInterface<NodeData, LinkData> | number;
  yStrength?: NodeIterationPropsInterface<NodeData, LinkData> | number;
};

export type NodeSettingsInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  cache?: boolean;
  idGetter?: NodeIterationPropsInterface<NodeData, LinkData, string | number>;
  highlightByNodeOnlyRoot?: boolean;
  highlightByNodeNodeFadingMin?: number;
  highlightByNodeNodeColorFadingMin?: number;
  highlightByNodeNodeSizingAdditional?: number;
  highlightByNodeNodeSizingAdditionalCoefficient?: number;
  highlightByNodeTextFadingMin?: number;
  highlightByNodeTextSizingAdditional?: number;
  highlightByNodeTextShiftXAdditional?: number;
  highlightByNodeTextShiftYAdditional?: number;
  highlightByNodeTextWeightAdditional?: number;
  highlightByNodeTextWidthAdditional?: number;
  highlightByLinkNodeFadingMin?: number;
  highlightByLinkNodeColorFadingMin?: number;
  highlightByLinkTextFadingMin?: number;
  highlightByLinkNodeSizingAdditional?: number;
  highlightByLinkNodeSizingAdditionalCoefficient?: number;
  highlightByLinkTextSizingAdditional?: number;
  highlightByLinkTextShiftXAdditional?: number;
  highlightByLinkTextShiftYAdditional?: number;
  highlightByLinkTextWeightAdditional?: number;
  highlightByLinkTextWidthAdditional?: number;
  highlightByHoverNode?: boolean;
  highlightByNodeNodeFading?: boolean;
  highlightByNodeNodeSizing?: boolean;
  highlightByNodeTextFading?: boolean;
  highlightByNodeTextSizing?: boolean;
  highlightByNodeNodeColor?: boolean;
  highlightByLinkNodeFading?: boolean;
  highlightByLinkNodeSizing?: boolean;
  highlightByLinkTextFading?: boolean;
  highlightByLinkTextSizing?: boolean;
  highlightByLinkNodeColor?: boolean;
  nodeRadiusCoefficient?: number;
  nodeRadiusFactor?: number;
  nodeRadiusFlexible?: boolean;
  nodeSizeFlexible?: boolean;
  nodeSizeCoefficient?: number;
  nodeSizeFactor?: number;
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
  shape?: NodeShape;
  width?: number;
  height?: number;
  borderRadius?: number;
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
  particles?: boolean;
  pretty?: boolean;
  arrow?: boolean;
  arrowByHighlight?: boolean;
  cache?: boolean;
  particleFlexSpeed?: boolean;
  particleFlexSpeedCoefficient?: number;
  highlightByNodeLinkFadingMin?: number;
  highlightByNodeArrowFadingMin?: number;
  highlightByLinkArrowFadingMin?: number;
  highlightByLinkLinkFadingMin?: number;
  highlightByHoverLink?: boolean;
  highlightByNodeLinkFading?: boolean;
  highlightByNodeArrowFading?: boolean;
  highlightByLinkLinkFading?: boolean;
  highlightByLinkArrowFading?: boolean;
  hoverLinkThreshold?: number;
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
  arrowAlpha?: number;
  arrowColor?: string;
  arrowSize?: number;
  arrowBorderColor?: string;
  arrowBorderWidth?: number;
  particleBorderColor?: string;
  particleBorderWidth?: number;
  particleAlpha?: number;
  particleColor?: string;
  particleRadius?: number;
  particleCount?: number;
  particleSteps?: number;
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
