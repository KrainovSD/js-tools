import type { LinkInterface } from "@/types/links";
import type { NodeInterface } from "@/types/nodes";

export type GraphCanvasInterface<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  nodes: NodeInterface<NodeData>[];
  links: LinkInterface<NodeData, LinkData>[];
  root: HTMLElement;
  settings?: GraphSettingInterface;
  forceOptions?: ForceOptions<NodeData, LinkData>;
  nodeOptions?: NodeOptions<NodeData>;
  linkOptions?: LinkOptions<NodeData, LinkData>;
  listeners?: Listeners;
};

export type GraphSettingInterface = {};

export type ForceOptions<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  collideOffMax?: {
    nodes: number;
    links: number;
  };
  collideRadius?: NodeIterationProps<NodeData> | number;
  collideStrength?: number;
  collideIterations?: number;
  linkDistance?: LinkIterationProps<NodeData, LinkData> | number;
  linkStrength?: LinkIterationProps<NodeData, LinkData> | number;
  linkIterations?: number;
  chargeStrength?: NodeIterationProps<NodeData> | number;
  chargeDistanceMax?: number;
  chargeDistanceMin?: number;
  centerPosition?: { x?: number; y?: number };
  centerStrength?: number;
  xForce?: NodeIterationProps<NodeData> | number;
  xStrength?: NodeIterationProps<NodeData> | number;
  yForce?: NodeIterationProps<NodeData> | number;
  yStrength?: NodeIterationProps<NodeData> | number;
};

export type NodeOptions<NodeData extends Record<string, unknown>> = {
  idGetter?: NodeIterationProps<NodeData, string | number>;
  radius?: NodeIterationProps<NodeData> | number;
  width?: NodeIterationProps<NodeData> | number;
  alpha?: NodeIterationProps<NodeData> | number;
  colorOuter?: NodeIterationProps<NodeData, string> | string;
  colorInner?: NodeIterationProps<NodeData, string> | string;
  font?: NodeIterationProps<NodeData, string> | string;
  fontColor?: NodeIterationProps<NodeData, string> | string;
  fontAlign?: NodeIterationProps<NodeData, string> | string;
};

export type LinkOptions<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  alpha?: LinkIterationProps<NodeData, LinkData> | number;
  color?: LinkIterationProps<NodeData, LinkData, string> | string;
  width?: LinkIterationProps<NodeData, LinkData> | number;
};

export type Listeners = {};

export type NodeIterationProps<NodeData extends Record<string, unknown>, Return = number> = (
  node: NodeInterface<NodeData>,
  i: number,
  nodes: NodeInterface<NodeData>[],
) => Return;

export type LinkIterationProps<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
  Return = number,
> = (
  link: LinkInterface<NodeData, LinkData>,
  i: number,
  links: LinkInterface<NodeData, LinkData>[],
) => Return;
