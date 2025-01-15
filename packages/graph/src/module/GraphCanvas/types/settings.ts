import type { LinkInterface, NodeInterface } from "@/types";

export type GraphCanvasSettingInterface = {};

export type GraphCanvasForceSettings<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  collideOn?: boolean;
  collideOffMax?: {
    nodes: number;
    links: number;
  };
  collideRadius?: GraphCanvasNodeIterationProps<NodeData> | number;
  collideStrength?: number;
  collideIterations?: number;
  linkDistance?: GraphCanvasLinkIterationProps<NodeData, LinkData> | number;
  linkStrength?: GraphCanvasLinkIterationProps<NodeData, LinkData> | number;
  linkIterations?: number;
  chargeStrength?: GraphCanvasNodeIterationProps<NodeData> | number;
  chargeDistanceMax?: number;
  chargeDistanceMin?: number;
  centerPosition?: { x?: number; y?: number };
  centerStrength?: number;
  xForce?: GraphCanvasNodeIterationProps<NodeData> | number;
  xStrength?: GraphCanvasNodeIterationProps<NodeData> | number;
  yForce?: GraphCanvasNodeIterationProps<NodeData> | number;
  yStrength?: GraphCanvasNodeIterationProps<NodeData> | number;
};

export type GraphCanvasNodeSettings<NodeData extends Record<string, unknown>> = {
  idGetter?: GraphCanvasNodeIterationProps<NodeData, string | number>;
  options?:
    | GraphCanvasNodeIterationProps<NodeData, GraphCanvasNodeOptions>
    | GraphCanvasNodeOptions;
};

export type GraphCanvasNodeOptions = {
  radius?: number;
  width?: number;
  alpha?: number;
  colorOuter?: string;
  colorInner?: string;
  text?: string | null;
  font?: string;
  fontColor?: string;
  fontAlign?: CanvasTextAlign;
};

export type GraphCanvasNodeIterationProps<
  NodeData extends Record<string, unknown>,
  Return = number,
> = (node: NodeInterface<NodeData>, i: number, nodes: NodeInterface<NodeData>[]) => Return;

export type GraphCanvasLinkSettings<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  options?:
    | GraphCanvasLinkIterationProps<NodeData, LinkData, GraphCanvasLinkOptions>
    | GraphCanvasLinkOptions;
};

export type GraphCanvasLinkOptions = {
  alpha?: number;
  color?: string;
  width?: number;
};

export type GraphCanvasLinkIterationProps<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
  Return = number,
> = (
  link: LinkInterface<NodeData, LinkData>,
  i: number,
  links: LinkInterface<NodeData, LinkData>[],
) => Return;
